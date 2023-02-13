using IngressAdapter.BusCommunication;
using IngressAdapter.BusCommunication.KAFKA;
using IngressAdapter.IngressCommunication;
using IngressAdapter.IngressCommunication.MQTT;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using Serilog;

namespace IngressAdapter.Controller;

public class Controller : IController
{
    private readonly IConfiguration _config;
    private IBusClient _busClient;
    private IIngressClient _ingressClient;
    private CancellationTokenSource cts = new CancellationTokenSource();
    public Controller(IConfiguration config)
    {
        _config = config;
    }

    public void Initialize()
    {
        Log.Debug("Initializing Controller");
        InitializeBusCommunication();
        InitializeIngressCommunication();
        PublishAvailabilityNotification();
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
    
    private void InitializeIngressCommunication()
    {
        _ingressClient = new MQTTIngressClient(_config);
        _ingressClient.Initialize(TransmitMessage);
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