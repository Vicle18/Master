using Microsoft.Extensions.Configuration;
using Confluent.Kafka;
using Newtonsoft.Json;
using Serilog;

namespace EgressAdapter.BusCommunication;

public class BusClient : IBusClient
{
    private bool requestSubscriptionUpdate = false;
    private string _host;
    private string _port;
    private IBusClient _IBusClient;
    private string _groupId;
    private readonly IConfiguration _config;
    private Dictionary<string, Action<string, string>> subscriptionHandlers;

    public BusClient(IConfiguration config)
    {
        _config = config;
        //_host = host;
        //_port = port;
        //_groupId = groupId;
        subscriptionHandlers = new Dictionary<string, Action<string, string>>();
    }

    public void Initialize()
    {
        throw new NotImplementedException();
    }

    public async Task Run()
    {
        var conf = new ConsumerConfig
        {
            GroupId = _groupId,
            BootstrapServers = _host + ":" + _port,
            AutoOffsetReset = AutoOffsetReset.Earliest,
        };
        await Task.Run(() =>
        {
            Log.Debug("Starting kafka subscriber with groupId {groupId}", _groupId);
            using (var consumer = new ConsumerBuilder<Ignore, string>(conf).Build())
            {
                Console.CancelKeyPress += (_, e) => { e.Cancel = true; };
                try
                {
                    while (true)
                    {
                        Log.Debug("waiting");
                        UpdateSubscriptions(consumer);
                        try
                        {
                            var consumeResult = consumer.Consume(5000);
                            if (consumeResult != null)
                            {
                                Log.Debug("Received message: " + consumeResult.Message.Value);
                                HandleConsumeResult(consumeResult);
                            }
                        }
                        catch (ConsumeException e)
                        {
                            Log.Error("Error occured while consuming: {error}", e.Error.Reason);
                        }
                        catch (JsonReaderException e)
                        {
                            Log.Error("Error occured while interpreting json: {error}", e.Message);
                        }
                    }
                }
                catch (OperationCanceledException)
                {
                    consumer.Close();
                }
            }
        });
    }

    private void HandleConsumeResult(ConsumeResult<Ignore, string> result)
    {
        Log.Debug($"Received Message from Kafka: {result.Message.Value}");
        if (subscriptionHandlers.ContainsKey(result.Topic))
        {
            Log.Debug("something happend in this busclient handleconsumeresult");
        }
    }

    public void UpdateSubscriptions(IConsumer<Ignore, string> consumer)
    {
        if (requestSubscriptionUpdate)
        {
            foreach (string topic in this.subscriptionHandlers.Keys.ToList())
            {
                Log.Debug("now subscribed to topic: {topic}", topic);
                consumer.Subscribe(topic);
            }

            requestSubscriptionUpdate = false;
        }

        ;
    }


    public void AddSubscription(string topic, Action<string, string> msgHandler)
    {
        Log.Debug("Adding subscription: {subscription}", topic);
        subscriptionHandlers.Add(topic, msgHandler);
        requestSubscriptionUpdate = true;
        //_producer.ProduceMessage(topic, new JObject(){["test"]="test"}.ToString());
    }

    public void RemoveSubscription(string topic)
    {
        if (subscriptionHandlers.Remove(topic))
        {
            requestSubscriptionUpdate = true;
            Log.Debug("Removing subscription: {subscription}", topic);
        }
        else
        {
            throw new ArgumentException($"Could not remove {topic}, was not found");
        }
    }

    public void PublishMessage(string topic, string message)
    {
       Log.Debug("BusClient", "PublishMessage Not implemented yet");
    }

    public void Subscribe(string topic)
    {
        Log.Debug("BusClient", "Subscribe Not implemented yet");
    }

    public void Publish(string topic, string message)
    {
        Log.Debug("BusClient", "Publish Not implemented yet");
    }
}