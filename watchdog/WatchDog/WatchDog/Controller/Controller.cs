using System.Text.Json;
using Newtonsoft.Json.Linq;
using WatchDog.BusCommunication;
using Serilog;
using WatchDog.BusCommunication.KAFKA;
using WatchDog.Models;
using WatchDog.Repositories;
using LoggerExtensions = Microsoft.Extensions.Logging.LoggerExtensions;

namespace WatchDog.Controller;

public class Controller : IController
{
    private readonly IConfiguration _config;
    private readonly ILogger<Controller> _logger;
    private IBusClient _busClient;
    private CancellationTokenSource cts = new CancellationTokenSource();
    private readonly IIngressRepository _ingressRepo;
    private readonly IEgressRepository _egressRepo;
    private Dictionary<string, Message> _receivedEgressBusMessages;
    private Dictionary<string, Message> _receivedObservableBusMessages;
    private Dictionary<string, string> _observables;
    private HashSet<string> _subscribedObservables;
    private List<string> _subscribedEgress;
    private bool loopActivated = false;

    public Controller(IConfiguration config, ILogger<Controller> logger, IEgressRepository egressRepo,
        IIngressRepository ingressRepo)
    {
        _config = config;
        _logger = logger;
        _egressRepo = egressRepo;
        _ingressRepo = ingressRepo;
        _receivedObservableBusMessages = new Dictionary<string, Message>();
        _receivedEgressBusMessages = new Dictionary<string, Message>();
        _subscribedObservables = new HashSet<string>();
        _subscribedEgress = new List<string>();
    }

    public Task Initialize()
    {
        try
        {
            Log.Debug("Initializing Controller");
            _busClient = new KafkaClient(_config);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }

        GetObservableElements();
        return null;
    }


    public void StartTransmission()
    {
        Console.CancelKeyPress += delegate(object? sender, ConsoleCancelEventArgs e)
        {
            e.Cancel = true;
            cts.Cancel();
        };

        Log.Debug("Starting Transmission");
        while (!cts.IsCancellationRequested)
        {
            JObject msg = new JObject()
            {
                ["id"] = _config.GetValue<string>("ID"),
                ["timestamp"] = DateTime.Now
            };
            _busClient.Publish("watchdog_availability", msg.ToString());
            Task.Delay(10000).Wait();
        }


        Log.Debug("Stopping transmission");
    }

    private async void GetObservableElements()
    {
        _observables = await _ingressRepo.getObservableProperties();
        var egressEndpointIds = await _egressRepo.getEgressEndpoints();
        _busClient.Subscribe("ingress_availability", HandleObservablePropertyMessages);
        _busClient.Subscribe("egress_availability", HandleEgressMessages);

        if (!loopActivated)
        {
            RunObservables();
            loopActivated = true;
        }
    }

    private void HandleEgressMessages(string topic, ReceivedBusMessage receivedBusMessage)
    {
        if (receivedBusMessage.Message.id != null)
        {
            _receivedEgressBusMessages[receivedBusMessage.Message.id] = new Message
            {
                id = receivedBusMessage.Message.id, status = receivedBusMessage.Message.status,
                timestamp = receivedBusMessage.Message.timestamp
            };
        }
    }

    private void HandleObservablePropertyMessages(string topic, ReceivedBusMessage receivedBusMessage)
    {
        // Ads or replaces the messages based on id

        if (receivedBusMessage.Message.id != null)
        {
            _receivedObservableBusMessages[receivedBusMessage.Message.id] = new Message
            {
                id = receivedBusMessage.Message.id, status = receivedBusMessage.Message.status,
                timestamp = receivedBusMessage.Message.timestamp
            };
        }
    }


    public void RunObservables()
    {
        try
        {
            Task.Run(async () =>
            {
                var cts = new CancellationTokenSource();
                Console.CancelKeyPress += (_, e) =>
                {
                    e.Cancel = true; // prevent the process from terminating.
                    cts.Cancel();
                };
                while (!cts.Token.IsCancellationRequested)
                {
                    try
                    {
                        DateTime lastCheck = DateTime.Now;
                        CheckObservableProperties(lastCheck);
                        CheckEgress(lastCheck);
                        Task _currentExecution = Task.Delay(5000, cts.Token);

                        await _currentExecution.ContinueWith(task => { Log.Debug("Still running"); });
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                        throw;
                    }
                }
            });
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    private void CheckObservableProperties(DateTime lastCheck)
    {
        foreach (var receivedBusMessage in _receivedObservableBusMessages)
        {
            if (lastCheck.ToUniversalTime() - receivedBusMessage.Value.timestamp.Value.ToUniversalTime() >
                TimeSpan.FromSeconds(20))
            {
                _ingressRepo.updateObservableStatus(receivedBusMessage.Key, "error", lastCheck.ToUniversalTime(),
                    receivedBusMessage.Value.timestamp);
                Log.Debug($"Error: {receivedBusMessage.Value.status}");
            }
            else
            {
                _ingressRepo.updateObservableStatus(receivedBusMessage.Key, receivedBusMessage.Value.status,
                    lastCheck.ToUniversalTime(), receivedBusMessage.Value.timestamp);
            }
        }
    }


    private void CheckEgress(DateTime lastCheck)
    {
        foreach (var receivedBusMessage in _receivedEgressBusMessages)
        {
            if (lastCheck.ToUniversalTime() - receivedBusMessage.Value.timestamp.Value.ToUniversalTime() >
                TimeSpan.FromSeconds(20))
            {
                _egressRepo.updateEgressStatus(receivedBusMessage.Key, "error", lastCheck.ToUniversalTime(),
                    receivedBusMessage.Value.timestamp);
                Log.Debug($"Error: {receivedBusMessage.Value.status}");
            }
            else
            {
                _egressRepo.updateEgressStatus(receivedBusMessage.Key, receivedBusMessage.Value.status,
                    lastCheck.ToUniversalTime(), receivedBusMessage.Value.timestamp);
            }
        }
    }
}