using Microsoft.Extensions.Configuration;
using Serilog;
using System.Text;
using EgressAdapter.BusCommunication;
using MQTTnet;
using MQTTnet.Client;

namespace EgressAdapter.EgressCommunication.MQTT;

public class MQTTEgressClient : IEgressClient
{
    private readonly IConfiguration _config;
    private MQTTConfiguration _mqttConfig;
    private CancellationTokenSource cts = new CancellationTokenSource();
    private readonly Dictionary<string, string> _transitionPairs;
    private static IMqttClient mqttClient;
    private MqttFactory factory;

    public MQTTEgressClient(IConfiguration config)
    {
        _config = config;
        _mqttConfig = new MQTTConfiguration();
        _config.GetSection("EGRESS_CONFIG").GetSection("PARAMETERS").Bind(_mqttConfig);
        Log.Debug("Received ingress config: {config}", _mqttConfig);
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
    
    public void Initialize(Action<string, string> messageHandler)
    {
        Task task = Task.Run(async () =>
        {
            Log.Debug($"Starting initializing MQTT receiver");
            await InitializeMqttClient(messageHandler);
            Log.Debug($"Finished initializing MQTT receiver");
            SubscribeToTopic("example");
        }, cts.Token);
    }

    public void StartPublishing()
    {
        throw new NotImplementedException();
    }

    private async Task ConnectToMQTT(string mqttHost, string mqttPort, string mqttClientId, Action<string, string> messageHandler)
        {
            Log.Debug( "Connecting to mqtt with broker: {broker}, and clientId {clientId}", mqttHost + ":" + mqttPort, mqttClientId);
            await Task.Run(async () =>
            {
                var options = new MqttClientOptionsBuilder()
                    .WithClientId(mqttClientId+new Random().Next())
                    .WithTcpServer(mqttHost
                        , int.Parse(mqttPort))
                    .Build();
                SetReceivingHandler(messageHandler);

                while (!mqttClient.IsConnected)
                {
                    Task currentExecution = Task.Delay(5000, new CancellationTokenSource().Token);
                    await currentExecution.ContinueWith(async task =>
                    {
                        try
                        {
                            mqttClient.ConnectAsync(options, CancellationToken.None).GetAwaiter().GetResult();
                            await StartHeartBeat(messageHandler);
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

    private async Task InitializeMqttClient(Action<string, string> messageHandler)
    {
        factory = new MqttFactory();
        mqttClient = factory.CreateMqttClient();
        await ConnectToMQTT(_mqttConfig.HOST, _mqttConfig.PORT, Guid.NewGuid().ToString(), messageHandler);
    }

    private async Task StartHeartBeat(Action<string, string> messageHandler)
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
            await InitializeMqttClient(messageHandler);
        }, cts.Token);
    }
    
    public async void SubscribeToTopic(string topic)
    {
        if (mqttClient.IsConnected)
        {
            Log.Debug( "Subscribing to MQTT topic {topic}", topic);
            await mqttClient.SubscribeAsync(new MqttTopicFilterBuilder().WithTopic(topic).Build());
        }
        else
        {
            Log.Debug( "could not subscribe to topic {topic}, because the client was not connected",
                topic);
        }
    }
    
    private void SetReceivingHandler(Action<string, string> messageHandler)
    {
        mqttClient.ApplicationMessageReceivedAsync += e =>
        {
            try
            {
                var message = Encoding.UTF8.GetString(e.ApplicationMessage.Payload);
                var topic = e.ApplicationMessage.Topic;
                Log.Debug($"Received MQTT message:{message} on topic {topic}");
                var targetTopic = _transitionPairs[topic];
                messageHandler(targetTopic, message);
                return Task.CompletedTask;
            }
            catch (Exception exception)
            {
                Log.Error(exception, "Error at mqtt receiving handler");
            }

            throw new InvalidOperationException();
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