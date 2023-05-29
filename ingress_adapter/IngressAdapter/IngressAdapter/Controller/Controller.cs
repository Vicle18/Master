using System.Globalization;
using Confluent.Kafka;
using IngressAdapter.BusCommunication;
using IngressAdapter.BusCommunication.KAFKA;
using IngressAdapter.Controller.FrequencyControl;
using IngressAdapter.Controller.FrequencyControl.FrequencyControllers;
using IngressAdapter.DataModel;
using IngressAdapter.IngressCommunication;
using IngressAdapter.IngressCommunication.MQTT;
using IngressAdapter.IngressCommunication.OPCUA;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
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
    private CancellationTokenSource _cts = new CancellationTokenSource();
    private readonly TransmissionDetails _transmissionDetails = new TransmissionDetails();
    private FrequencyController _frequencyController;

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
            _config.GetSection("INGRESS_CONFIG").GetSection("TRANSMISSION_DETAILS").Bind(_transmissionDetails);
            InitializeBusCommunication();
            _logger.LogDebug("{freq} {changedFres}", _transmissionDetails.FREQUENCY, _transmissionDetails.CHANGED_FREQUENCY);
            if (_transmissionDetails.FREQUENCY != _transmissionDetails.CHANGED_FREQUENCY)
            {
                InitializeFrequencyController();
            }
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
            
            ["timestamp"]=DateTime.Now,
            ["status"]= _ingressClient.IsConnected() ? "running" : _ingressClient.GetStatusMessage(),
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

            await _ingressClient.Initialize(_transmissionDetails.FREQUENCY == _transmissionDetails.CHANGED_FREQUENCY ? TransmitMessage : TransmitMessageWithFrequencyChange);
            _logger.LogDebug("Starting ingestion");
            _ingressClient.StartIngestion(_transmissionDetails);
            
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
        
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
        _frequencyController.StartTransmission(float.Parse(_transmissionDetails.CHANGED_FREQUENCY, NumberStyles.Any,ci), TransmitMessage);
    }

    public void StartTransmission()
    {
        Console.CancelKeyPress += delegate(object? sender, ConsoleCancelEventArgs e) {
            e.Cancel = true;
            _cts.Cancel();
        };
        Log.Debug("Starting Transmission");
        while (!_cts.IsCancellationRequested)
        {
            PublishAvailabilityNotification();
            Task.Delay(5000).Wait();
        }
        Log.Debug("Stopping transmission");
    }

    private void TransmitMessageWithFrequencyChange(string value)
    {
        // Log.Debug("Received message {message} from, changing frequency", value);
        _frequencyController.AddMessage(value);
    }
    
    private void TransmitMessage(string value)
    {
        _busClient.Publish(_transmissionDetails.TARGET_TOPIC, value);
        Log.Debug("Transmitting message: {message} to topic: {topic}", value, _transmissionDetails.TARGET_TOPIC);
    }
}