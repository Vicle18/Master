using System.Text;
using Microsoft.Extensions.Configuration;
using MQTTnet;
using MQTTnet.Client;
using Newtonsoft.Json.Linq;
using Serilog;

namespace IngressAdapter.IngressCommunication.MQTT;

public class MQTTIngressClient : IIngressClient
{
    private readonly IConfiguration _config;
    private MQTTConfiguration _mqttConfig;
    private CancellationTokenSource cts = new CancellationTokenSource();
    private readonly Dictionary<string, string> _transitionPairs;
    private static IMqttClient mqttClient;
    private MqttFactory factory;

    public MQTTIngressClient(IConfiguration config)
    {
        
        _config = config;
        _mqttConfig = new MQTTConfiguration();
        _config.GetSection("INGRESS_CONFIG").GetSection("PARAMETERS").Bind(_mqttConfig);
        // _host = config.GetValue<string>("HOST");
        // _port = config.GetValue<string>("PORT");
        // _clientId = config.GetValue<string>("CLIENT_ID");
        Log.Debug("Starting MQTT");
        Console.WriteLine($"Received config: {_mqttConfig}");
        Log.Debug("Received config: {config}", _mqttConfig);
        _transitionPairs = new Dictionary<string, string>();
        ExtractTransitionPairs(_mqttConfig.TRANSMISSION_PAIRS);
    }

    private void ExtractTransitionPairs(string pairs)
    {
        string[] pairArray = pairs.Split(",");
        foreach (var stringPair in pairArray)
        {
            var pair = stringPair.Split(":");
            _transitionPairs.Add(pair[0], pair[1]);
        }
        Log.Debug("Extracted TransitionPairs: {transitionpairs} ", string.Join(", ", _transitionPairs) );
    }
    
    public void Initialize()
    {
        Task task = Task.Run(async () =>
        {
            Log.Debug($"Starting initializing MQTT receiver");
            await InitializeMqttClient();
            Log.Debug($"Finished initializing MQTT receiver");
        }, cts.Token);
    }
    
    private async Task ConnectToMQTT(string mqttHost, string mqttPort, string mqttClientId)
        {
            Log.Debug( "Connecting to mqtt with broker: {broker}, and clientId {clientId}", mqttHost + ":" + mqttPort, mqttClientId);
            await Task.Run(async () =>
            {
                var options = new MqttClientOptionsBuilder()
                    .WithClientId(mqttClientId+new Random().Next())
                    .WithTcpServer(mqttHost
                        , int.Parse(mqttPort))
                    .Build();
                SetReceivingHandler();
                while (!mqttClient.IsConnected)
                {
                    Task currentExecution = Task.Delay(5000, new CancellationTokenSource().Token);
                    await currentExecution.ContinueWith(async task =>
                    {
                        try
                        {
                            mqttClient.ConnectAsync(options, CancellationToken.None).GetAwaiter().GetResult();
                            await StartHeartBeat();
                        }
                        catch (MQTTnet.Exceptions.MqttCommunicationTimedOutException ex)
                        {
                            Log.Error( ex,
                                "could not connect to MQTT broker with ip {ip} and port: {port}",
                                mqttHost, mqttPort);
                        }
                        catch (MQTTnet.Exceptions.MqttCommunicationException ex)
                        {
                            Log.Error(ex,
                                "could not connect to MQTT broker with ip {ip} and port: {port}",
                                mqttHost, mqttPort);
                        }
                    });
                }
            });
        }

    private async Task InitializeMqttClient()
    {
        factory = new MqttFactory();
        mqttClient = factory.CreateMqttClient();
        await ConnectToMQTT(_mqttConfig.HOST, _mqttConfig.PORT, Guid.NewGuid().ToString());
    }

    private async Task StartHeartBeat()
    {
        Log.Debug( "Starting heartbeat");
        await Task.Run(async () =>
        {
            while (mqttClient.IsConnected)
            {
                cts.Token.ThrowIfCancellationRequested();
                await Task.Delay(5000, new CancellationTokenSource().Token).ContinueWith(task =>
                {
                    Log.Information("Still connected to MQTT Broker");
                });
            }
            await InitializeMqttClient();
        }, cts.Token);
    }
    
    private void SetReceivingHandler()
    {
        mqttClient.ApplicationMessageReceivedAsync += e =>
        {
            Log.Debug( 
                $"Received MQTT message:{Encoding.UTF8.GetString(e.ApplicationMessage.Payload)} on topic {e.ApplicationMessage.Topic}");
            //HANDLE MESSAGE HERE, I.E. SEND TO CONTROLLER
            return Task.CompletedTask;
        };
    }

    public void StartIngestion()
    {
        
    }
    
    public bool HasConnection()
    {
        return mqttClient?.IsConnected ?? false;
    }

    public void Disconnect()
    {
        mqttClient.DisconnectAsync();
    }
}