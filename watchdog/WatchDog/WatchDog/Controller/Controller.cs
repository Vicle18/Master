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
    private List<ReceivedBusMessage> _receivedEgressBusMessages;
    private List<ReceivedBusMessage> _receivedObservableBusMessages;
    private Dictionary<string, string> _observables;
    private HashSet<string> _subscribedObservables;
    private List<string> _subscribedEgress;


    public Controller(IConfiguration config, ILogger<Controller> logger, IEgressRepository egressRepo,
        IIngressRepository ingressRepo)
    {
        _config = config;
        _logger = logger;
        _egressRepo = egressRepo;
        _ingressRepo = ingressRepo;
        _receivedObservableBusMessages = new List<ReceivedBusMessage>();
        _receivedEgressBusMessages = new List<ReceivedBusMessage>();
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
        Log.Debug(JsonSerializer.Serialize(_observables));

        foreach (var observable in _observables)
        {
            if (!_subscribedObservables.Contains(observable.Key))
            {
                _busClient.Subscribe(observable.Key, HandleObservablePropertyMessages);
                _subscribedObservables.Add(observable.Key);
            }
        }

        /*foreach (var egress in egressEndpointIds)
        {
            _busClient.Subscribe(egress, HandleEgressMessages);
        }*/

        RunObservables();
    }

    private void HandleEgressMessages(string topic, ReceivedBusMessage message)
    {
        _receivedEgressBusMessages.Add(message);
    }

    private void HandleObservablePropertyMessages(string topic, ReceivedBusMessage message)
    {
        _receivedObservableBusMessages.Add(message);
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
                        GetObservableElements();
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
            if (lastCheck.ToUniversalTime() - receivedBusMessage.TimeStamp.ToUniversalTime() > TimeSpan.FromSeconds(20))
            {
                _ingressRepo.updateObservableStatus(
                    _observables.FirstOrDefault(x => x.Key == receivedBusMessage.Topic).Value, "error",
                    lastCheck.ToUniversalTime());
            }
            else
            {
                _ingressRepo.updateObservableStatus(
                    _observables.FirstOrDefault(x => x.Key == receivedBusMessage.Topic).Value, "running",
                    lastCheck.ToUniversalTime()
                );
            }
        }
    }


    private void CheckEgress(DateTime lastCheck)
    {
        foreach (var receivedBusMessage in _receivedEgressBusMessages)
        {
            if (lastCheck.ToUniversalTime() - receivedBusMessage.TimeStamp.ToUniversalTime() > TimeSpan.FromSeconds(20))
            {
                _egressRepo.updateEgressStatus(receivedBusMessage.Topic, "running", lastCheck.ToUniversalTime());
            }
            else
            {
                _egressRepo.updateEgressStatus(receivedBusMessage.Topic, "error", lastCheck.ToUniversalTime());
            }
        }
    }
}