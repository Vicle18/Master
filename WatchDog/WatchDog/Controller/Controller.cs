using Newtonsoft.Json.Linq;
using WatchDog.BusCommunication;
using Serilog;
using WatchDog.BusCommunication.KAFKA;
using WatchDog.Repositories;

namespace WatchDog.Controller;

public class Controller : IController
{
    private readonly IConfiguration _config;
    private readonly ILogger<Controller> _logger;
    private IBusClient _busClient;
    private CancellationTokenSource cts = new CancellationTokenSource();
    private readonly IIngressRepository _ingressRepo;
    private readonly IEgressRepository _egressRepo;
    private List<string> _observableIds;


    public Controller(IConfiguration config, ILogger<Controller> logger, IEgressRepository egressRepo,
        IIngressRepository ingressRepo)
    {
        _config = config;
        _logger = logger;
        _egressRepo = egressRepo;
        _ingressRepo = ingressRepo;
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

        getObservableProperties();
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

    private async void getObservableProperties()
    {
        _observableIds = await _ingressRepo.getObservableProperties();
        foreach (var observableId in _observableIds)
        {
            _busClient.Subscribe(observableId, HandleMessage);
        }
    }

    private void HandleMessage(string arg1, string arg2)
    {
        Log.Debug("Inside handler");
        Log.Debug("arg1" + arg1);
        Log.Debug("arg2" + arg2);
        
        // Extract last time of last received value
        // Update status ingress repository
        
        //throw new NotImplementedException();
    }

    private void getEgressProperties()
    {
    }
}