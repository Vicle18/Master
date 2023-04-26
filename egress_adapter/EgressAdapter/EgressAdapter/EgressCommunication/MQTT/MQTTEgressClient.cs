using Microsoft.Extensions.Configuration;
using Serilog;
using System.Text;
using EgressAdapter.BusCommunication;
using MQTTnet;
using MQTTnet.Client;
using Newtonsoft.Json.Linq;

namespace EgressAdapter.EgressCommunication.MQTT;

public class MQTTEgressClient : IEgressClient
{
    private readonly IConfiguration _config;
    private MQTTConfiguration _mqttConfig;
    private CancellationTokenSource cts = new CancellationTokenSource();
    private readonly Dictionary<string, string> _transitionPairs;
    private static IMqttClient mqttClient;
    private MqttFactory factory;
    private string _statusMessage;

    public MQTTEgressClient(IConfiguration config)
    {
        _config = config;
        _mqttConfig = new MQTTConfiguration();
        _config.GetSection("EGRESS_CONFIG").GetSection("PARAMETERS").Bind(_mqttConfig);
        Log.Debug("Received ingress config: {config}", _mqttConfig);
        InitializeMqttClient().Wait();
    }

    public void Initialize(IBusClient busClient)
    {
        // Task task = Task.Run(async () =>
        // {
        //     Log.Debug($"Starting initializing MQTT receiver");
        //     Log.Debug($"Finished initializing MQTT receiver");
        //
        //     foreach (var pair in _transitionPairs)
        //     {
        //         busClient.Subscribe(pair.Key, (topic, value) => 
        //             PublishToTopic(pair.Value, value)
        //         );
        //     }
        // }, cts.Token);
    }

    private async Task ConnectToMQTT(string mqttHost, string mqttPort, string mqttClientId)
    {
        Log.Debug("Connecting to mqtt with broker: {broker}, and clientId {clientId}", mqttHost + ":" + mqttPort,
            mqttClientId);
        await Task.Run(async () =>
        {
            var options = new MqttClientOptionsBuilder()
                .WithClientId(mqttClientId + new Random().Next())
                .WithTcpServer(mqttHost
                    , int.Parse(mqttPort))
                .Build();

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
                        Log.Error(ex,
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

    private async Task InitializeMqttClient()
    {
        factory = new MqttFactory();
        mqttClient = factory.CreateMqttClient();
        await ConnectToMQTT(_mqttConfig.HOST, _mqttConfig.PORT, Guid.NewGuid().ToString());
    }

    private async Task StartHeartBeat()
    {
        Log.Debug("Starting heartbeat");
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

    public async Task PublishMessage(string message, string target)
    {
        Log.Debug("Publishing message {preparedMessage} to MQTT {topic}", message, target);
        var publishMessage = new MqttApplicationMessageBuilder()
            .WithTopic(target)   
            .WithPayload(message)
            .Build();
        await mqttClient.PublishAsync(publishMessage);
        Log.Debug("Published message {message} to MQTT {topic}", message, target);
    }

    public bool IsConnected()
    {
        return mqttClient?.IsConnected ?? false;
    }

    public string GetStatusMessage()
    {
        return _statusMessage;
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