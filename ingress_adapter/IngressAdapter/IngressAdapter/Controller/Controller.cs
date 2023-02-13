using IngressAdapter.BusCommunication;
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
        _busClient = new BusClient(_config);
    }
    
    private void InitializeIngressCommunication()
    {
        _ingressClient = new MQTTIngressClient(_config);
        _ingressClient.Initialize();
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
            
        }
        Log.Debug("Stopping transmission");
    }

    public void TransmitMessage()
    {
        
    }
}