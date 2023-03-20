using IngressAdapter.BusCommunication;
using IngressAdapter.BusCommunication.KAFKA;
using IngressAdapter.IngressCommunication;
using IngressAdapter.IngressCommunication.MQTT;
using IngressAdapter.IngressCommunication.OPCUA;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using Serilog;

namespace IngressAdapter.Controller;

public class Controller : IController
{
    private readonly IConfiguration _config;
    private readonly IIngressClientCreator _clientCreator;
    private IBusClient _busClient;
    private IIngressClient _ingressClient;
    private CancellationTokenSource cts = new CancellationTokenSource();
    public Controller(IConfiguration config, IIngressClientCreator clientCreator)
    {
        _config = config;
        _clientCreator = clientCreator;
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
            ["id"]="TempID",
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
        var clientType = _config.GetSection("INGRESS_CONFIG").GetValue<string>("PROTOCOL") ?? throw new ArgumentException();
        _ingressClient = _clientCreator.CreateIngressClient(clientType);
        await _ingressClient.Initialize(TransmitMessage);
        _ingressClient.StartIngestion();
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
            Task.Delay(3000).Wait();
        }
        Log.Debug("Stopping transmission");
    }

    private void TransmitMessage(string targetTopic, string value)
    {
        _busClient.Publish(targetTopic, value);
        Log.Debug("Transmitting message: {message} to topic: {topic}", value, targetTopic);
    }
}