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


    public Controller(IConfiguration config, ILogger<Controller> logger, IEgressRepository egressRepo,
        IIngressRepository ingressRepo)
    {
        _config = config;
        _logger = logger;
        _egressRepo = egressRepo;
        _ingressRepo = ingressRepo;
        _receivedObservableBusMessages = new List<ReceivedBusMessage>();
        _receivedEgressBusMessages = new List<ReceivedBusMessage>();
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
        var observablePropertyIds = await _ingressRepo.getObservableProperties();
        var egressEndpointIds = await _egressRepo.getEgressEndpoints();
        List<string> observableElementIds = observablePropertyIds.Concat(egressEndpointIds).ToList();
        Log.Debug(JsonSerializer.Serialize(observablePropertyIds));
        foreach (var observableId in observablePropertyIds)
        {
            _busClient.Subscribe(observableId, HandleObservablePropertyMessages);
        }

        foreach (var egressId in egressEndpointIds)
        {
            _busClient.Subscribe(egressId, HandleEgressMessages);
        }

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
        Log.Debug("Inside Run method");
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
            if (lastCheck.ToUniversalTime() - receivedBusMessage.TimeStamp.ToUniversalTime() > TimeSpan.FromSeconds(20))
            {
                _logger.LogError("The topic {topicId} is not longer active", receivedBusMessage.Topic);
                _ingressRepo.updateObservableStatus(receivedBusMessage.Topic, "error", lastCheck.ToUniversalTime());
            }
            else
            {
                _ingressRepo.updateObservableStatus(receivedBusMessage.Topic, "running", lastCheck.ToUniversalTime()
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
                _logger.LogError("The topic {topicId} is not longer active", receivedBusMessage.Topic);
                _egressRepo.updateEgressStatus(receivedBusMessage.Topic, false, lastCheck.ToUniversalTime());
            }
            else
            {
                _egressRepo.updateEgressStatus(receivedBusMessage.Topic, true, lastCheck.ToUniversalTime());
            }
        }
    }
}