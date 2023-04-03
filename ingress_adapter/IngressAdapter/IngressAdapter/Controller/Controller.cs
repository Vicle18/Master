using IngressAdapter.BusCommunication;
using IngressAdapter.BusCommunication.KAFKA;
using IngressAdapter.IngressCommunication;
using IngressAdapter.IngressCommunication.MQTT;
using IngressAdapter.IngressCommunication.OPCUA;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using Opc.Ua.Gds.Client;
using Serilog;

namespace IngressAdapter.Controller;

public class Controller : IController
{
    private readonly IConfiguration _config;
    private readonly IIngressClientCreator _clientCreator;
    private readonly ILogger<Controller> _logger;
    private IBusClient _busClient;
    private IIngressClient _ingressClient;
    private CancellationTokenSource cts = new CancellationTokenSource();
    public Controller(IConfiguration config, IIngressClientCreator clientCreator, ILogger<Controller> logger)
    {
        _config = config;
        _clientCreator = clientCreator;
        _logger = logger;
    }

    public async Task Initialize()
    {
        try
        {
            Log.Debug("Initializing Controller");
            InitializeBusCommunication();
            await InitializeIngressCommunication();
            PublishAvailabilityNotification();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    private void PublishAvailabilityNotification()
    {
        JObject msg = new JObject()
        {
            ["id"]=_config.GetValue<string>("ID"),
            ["available"]=true
        };
        _busClient.Publish("ingress_availability", msg.ToString());
    }

    private void InitializeBusCommunication()
    {
        _busClient = new KafkaClient(_config);
    }
    
    private async Task InitializeIngressCommunication()
    {
        try
        {
            _logger.LogDebug("Initializing Ingress Communication");
            var clientType = _config.GetSection("INGRESS_CONFIG").GetValue<string>("PROTOCOL") ?? throw new ArgumentException();
            _ingressClient = _clientCreator.CreateIngressClient(clientType);
            _logger.LogDebug("Initializing ingestion");

            await _ingressClient.Initialize(TransmitMessage);
            _logger.LogDebug("Starting ingestion");
            _ingressClient.StartIngestion();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
        
    }

    public void StartTransmission()
    {
        Console.CancelKeyPress += delegate(object? sender, ConsoleCancelEventArgs e) {
            e.Cancel = true;
            cts.Cancel();
        };
        Log.Debug("Starting Transmission");
        while (!cts.IsCancellationRequested)
        {
            JObject msg = new JObject()
            {
                ["id"]=_config.GetValue<string>("ID"),
                ["timestamp"]=DateTime.Now
            };
            _busClient.Publish("ingress_availability", msg.ToString());
            Task.Delay(5000).Wait();
        }
        Log.Debug("Stopping transmission");
    }

    private void TransmitMessage(string targetTopic, string value)
    {
        _busClient.Publish(targetTopic, value);
        Log.Debug("Transmitting message: {message} to topic: {topic}", value, targetTopic);
    }
}