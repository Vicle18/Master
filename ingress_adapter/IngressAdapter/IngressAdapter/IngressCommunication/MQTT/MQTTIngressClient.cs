using System.Text;
using IngressAdapter.DataModel;
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
    private static IMqttClient mqttClient;
    private MqttFactory factory;
    private float _accumulatedValue = 0;
    private float _messageCounter = 0;
    private Action<string> _messageHandler;
    private string _statusMessage = "";
    public MQTTIngressClient(IConfiguration config)
    {
        _config = config;
        _mqttConfig = new MQTTConfiguration();
        _config.GetSection("INGRESS_CONFIG").GetSection("PARAMETERS").Bind(_mqttConfig);
        Log.Debug("Received ingress config: {config}", _mqttConfig);

    }

    public async Task<bool> Initialize(Action<string> messageHandler)
    {
        _messageHandler = messageHandler;
        Task task = Task.Run(async () =>
        {
            Log.Debug($"Starting initializing MQTT receiver");
            await InitializeMqttClient(messageHandler);
            Log.Debug($"Finished initializing MQTT receiver");
            SubscribeToTopic(_mqttConfig.TOPIC);
        }, cts.Token);
        await task;
        return true;
    }
    
    private async Task ConnectToMQTT(string mqttHost, string mqttPort, string mqttClientId, Action<string> messageHandler)
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
                            _statusMessage =
                                $"could not connect to MQTT broker with ip {mqttHost} and port: {mqttPort}, {ex.Message}";
                        }
                        catch (MQTTnet.Exceptions.MqttCommunicationException ex)
                        {
                            Log.Error(ex,
                                "could not connect to MQTT broker with ip {ip} and port: {port}",
                                mqttHost, mqttPort);
                            _statusMessage =
                                $"could not connect to MQTT broker with ip {mqttHost} and port: {mqttPort}, {ex.Message}";
                        }
                    });
                }
            });
        }

    private async Task InitializeMqttClient(Action<string> messageHandler)
    {
        factory = new MqttFactory();
        mqttClient = factory.CreateMqttClient();
        await ConnectToMQTT(_mqttConfig.HOST, _mqttConfig.PORT, Guid.NewGuid().ToString(), messageHandler);
    }

    private async Task StartHeartBeat(Action<string> messageHandler)
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
    
    private void SetReceivingHandler(Action<string> messageHandler)
    {
        mqttClient.ApplicationMessageReceivedAsync += e =>
        {
            try
            {
                var message = Encoding.UTF8.GetString(e.ApplicationMessage.Payload);
                var topic = e.ApplicationMessage.Topic;
                Log.Debug($"Received MQTT message:{message} on topic {topic}");
                messageHandler(message);
                return Task.CompletedTask;
            }
            catch (Exception exception)
            {
                Log.Error(exception, "Error at mqtt receiving handler");
            }

            throw new InvalidOperationException();
        };
    }

    public void StartIngestion(TransmissionDetails transmissionDetails)
    {
        // var cts = new CancellationTokenSource();
        //
        // var task = Task.Run(() =>
        // {
        //     
        // }, CancellationToken.None);
    }

    public bool IsConnected()
    {
        return mqttClient?.IsConnected ?? false;
    }

    public string GetStatusMessage()
    {
        return _statusMessage;
    }
    

    public void Disconnect()
    {
        mqttClient.DisconnectAsync();
    }
}