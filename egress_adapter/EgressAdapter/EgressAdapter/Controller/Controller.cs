using System.Globalization;
using EgressAdapter.BusCommunication;
using EgressAdapter.BusCommunication.KAFKA;
using EgressAdapter.Datamodel;
using EgressAdapter.EgressCommunication;
using EgressAdapter.EgressCommunication.MQTT;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using Serilog;

namespace EgressAdapter.Controller;

public class Controller : IController
{
    private readonly IConfiguration _config;
    private readonly IEgressClientCreator _egressClientCreator;
    private IBusClient _busClient;
    private IEgressClient _egressClient;
    private CancellationTokenSource cts = new CancellationTokenSource();
    private readonly TransmissionDetails _transmissionDetails = new TransmissionDetails();
    private FrequencyController _frequencyController;
    
    public Controller(IConfiguration config, IEgressClientCreator egressClientCreator)
    {
        _config = config;
        _egressClientCreator = egressClientCreator;
        _config.GetSection("EGRESS_CONFIG").GetSection("TRANSMISSION_DETAILS").Bind(_transmissionDetails);
    }


    public void Initialize()
    {
        Log.Debug("Initializing Controller");
        InitializeBusCommunication();
        InitializeEgressCommunication();
        if (_transmissionDetails.FREQUENCY != _transmissionDetails.CHANGED_FREQUENCY)
        {
            InitializeFrequencyController();
        }
        _busClient.Subscribe(
            _transmissionDetails.ORIGIN_TOPIC, 
            _transmissionDetails.FREQUENCY == _transmissionDetails.CHANGED_FREQUENCY ? 
                MessageHandler : FrequencyChangingMessageHandler
        );
        PublishAvailabilityNotification();
        
    }

    private void InitializeFrequencyController()
    {
        Log.Debug("Initializing Frequency Controller for {method} downsampling", _transmissionDetails.DOWN_SAMPLING_METHOD);
        switch (_transmissionDetails.DOWN_SAMPLING_METHOD)
        {
            case "AVERAGE":
                _frequencyController = new AverageFrequencyController();
                break;
            case "MEDIAN":
                _frequencyController = new MedianFrequencyController();
                break;
            case "LATEST":
                _frequencyController = new LatestFrequencyController();
                break;
            case "ACCUMULATED":
                _frequencyController = new AccumulatedStringFrequencyController();
                break;
            default:
                _frequencyController = new LatestFrequencyController();
                break;
        }
        // Required to make sure that the "." is used as separator
        CultureInfo ci = (CultureInfo)CultureInfo.CurrentCulture.Clone();
        ci.NumberFormat.CurrencyDecimalSeparator = ".";
        _frequencyController.StartTransmission(float.Parse(_transmissionDetails.CHANGED_FREQUENCY, NumberStyles.Any,ci),
            _transmissionDetails.TARGET, MessageHandler);
    }

    private void PublishAvailabilityNotification()
    {
        JObject msg = new JObject()
        {
            ["id"]=_config.GetValue<string>("ID"),
            ["timestamp"]=DateTime.Now,
            ["status"]= _egressClient.IsConnected() ? "running" : _egressClient.GetStatusMessage(),
        };
        _busClient.Publish("ingress_availability", msg.ToString());
    }

    private void MessageHandler(string topic, string msg)
    {
        Log.Debug("adding metadata to {message} from {topic}", msg, topic);
        var message = "";
        if (_transmissionDetails.DATA_FORMAT == "RAW")
        {
            message = msg;
        }
        else if (_transmissionDetails is {DATA_FORMAT: "WITH_METADATA", METADATA: { }})
        {
            var metadataObject = new JObject
            {
                ["value"] = msg
            };
            if (_transmissionDetails.METADATA.TIMESTAMP ?? false)
            {
                metadataObject["timestamp"] = DateTime.Now.ToUniversalTime();
            }
            if (_transmissionDetails.METADATA.ID != null)
            {
                metadataObject["id"] = _transmissionDetails.METADATA.ID;
            }
            if (_transmissionDetails.METADATA.NAME != null)
            {
                metadataObject["name"] = _transmissionDetails.METADATA.NAME;
            }
            if (_transmissionDetails.METADATA.FREQUENCY != null)
            {
                metadataObject["frequency"] = _transmissionDetails.METADATA.FREQUENCY;
            }
            if (_transmissionDetails.METADATA.DESCRIPTION != null)
            {
                metadataObject["description"] = _transmissionDetails.METADATA.DESCRIPTION;
            }
            message = metadataObject.ToString();
        }
        else
        {
            throw new ArgumentException("Could not interpret data format");
        }
        _egressClient.PublishMessage(message, _transmissionDetails.TARGET);
    }
    
    private void FrequencyChangingMessageHandler(string topic, string message)
    {
        Log.Debug("Received KAFKA message {message} from {topic}, changing frequency", message, topic);
        _frequencyController.AddMessage(message);
    }

    private void InitializeEgressCommunication()
    {
        var clientType = _config.GetSection("EGRESS_CONFIG").GetValue<string>("PROTOCOL") ?? throw new ArgumentException();
        _egressClient = _egressClientCreator.CreateEgressClient(clientType);
        // _egressClient.Initialize(_busClient);
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
            PublishAvailabilityNotification();
            Task.Delay(5000).Wait();
        }
        _frequencyController.StopTransmission();
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