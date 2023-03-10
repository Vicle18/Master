using EgressAdapter.BusCommunication;
using EgressAdapter.BusCommunication.KAFKA;
using EgressAdapter.EgressCommunication;
using EgressAdapter.EgressCommunication.MQTT;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using Serilog;

namespace EgressAdapter.Controller;

public class Controller : IController
{
    private readonly IConfiguration _config;
    private IBusClient _busClient;
    private IEgressClient _egressClient;
    private CancellationTokenSource cts = new CancellationTokenSource();

    public Controller(IConfiguration config)
    {
        _config = config;
//        _busClient = busClient;
//        _egressClient = egressClient;
    }


    public void Initialize()
    {
        Log.Debug("Initializing Controller");
        InitializeBusCommunication();
        InitializeEgressCommunication();
        PublishAvailabilityNotification();
        SubscribeToKafkaTopic("test");
    }


    private void PublishAvailabilityNotification()
    {
        JObject msg = new JObject()
        {
            ["id"] = "DoesItWork",
            ["available"] = true
        };
        _busClient.Publish("test", msg.ToString());
    }

    private void SubscribeToKafkaTopic(string topic)
    {
        Log.Debug("Subscribing to KAFKA TOPIC");
        _busClient.Subscribe(topic, MessageHandler);
    }

    private void MessageHandler(string topic, string message)
    {
        Log.Debug("Received KAFKA message {message} from {topic}", message, topic);
    }

    private void InitializeEgressCommunication()
    {
        _egressClient = new MQTTEgressClient(_config);
        _egressClient.Initialize(_busClient);
    }

    private void TransmitMessage(string arg1, string arg2)
    {
        Log.Debug("Transmitting message: {message} to topic: {topic}", arg1, arg2);
    }

    private void InitializeBusCommunication()
    {
        _busClient = new KafkaClient(_config);
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
        }

        Log.Debug("Stopping transmission");
    }

    public void Filter()
    {
        throw new NotImplementedException();
    }

    public void Merging()
    {
        throw new NotImplementedException();
    }
}