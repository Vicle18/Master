using Confluent.Kafka;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Serilog;

namespace IngressAdapter.BusCommunication.KAFKA
{
    /// <summary>
    /// An implementation, that is based on a single kafka consumer, that is able to handle multiple subscriptions - downside is handling of switching between topics,
    /// while no EOF message is received, it will continue listening to the topic, and only switching on receival of EOF. Might be the wrong choice, when one topic
    /// will receive a continuous stream of messages.
    /// </summary>
    public class KafkaReceiver : IKafkaReceiver
    {
        private bool requestSubscriptionUpdate = false;
        private string _host;
        private string _port;
        private IKafkaProducer _producer;
        private string _groupId;
        private Dictionary<string, Action<string, string>> subscriptionHandlers;
        public KafkaReceiver(string host, string port, string groupId, IKafkaProducer producer)
        {
            _host = host;
            _port = port;
            _groupId = groupId;
            _producer = producer;
            subscriptionHandlers = new Dictionary<string, Action<string, string>>();
        }
        public void AddSubscription(string topic, Action<string, string> msgHandler)
        {
            Log.Debug(  "Adding subscription: {subscription}", topic);
            subscriptionHandlers.Add(topic, msgHandler);
            requestSubscriptionUpdate = true;
            _producer.ProduceMessage(topic, new JObject(){["test"]="test"}.ToString());
        }

        public void RemoveSubscription(string topic)
        {
            
            if (subscriptionHandlers.Remove(topic))
            {
                requestSubscriptionUpdate = true;
                Log.Debug(  "Removing subscription: {subscription}", topic);
            }
            else
            {
                throw new ArgumentException($"Could not remove {topic}, was not found");
            }
            
        }

        public List<string> GetSubscriptions()
        {
            return this.subscriptionHandlers.Keys.ToList();
        }

        private void UpdateSubscriptions(IConsumer<Ignore, string> consumer)
        {
            if (requestSubscriptionUpdate) {
                foreach(string topic in GetSubscriptions())
                {
                    Log.Debug(  "now subscribed to topic: {topic}", topic);
                    consumer.Subscribe(topic);
                }
                
                requestSubscriptionUpdate = false;
            };
        }

        private void HandleConsumeResult(ConsumeResult<Ignore, string> result)
        {
            Log.Debug(  $"Received Message from Kafka: {result.Message.Value}");
            if (subscriptionHandlers.ContainsKey(result.Topic))
            {
                // subscriptionHandlers[result.Topic](result.Topic, new ReceivedBusMessage()
                // {
                //     Topic = result.Topic,
                //     Message = JObject.Parse(result.Message.Value),
                //     TimeStamp = result.Message.Timestamp.UtcDateTime,
                //     Raw = JsonConvert.SerializeObject(result)
                // });
            }
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
                Log.Debug(  "Starting kafka subscriber with groupId {groupId}", _groupId);
                using (var consumer = new ConsumerBuilder<Ignore, string>(conf).Build())
                {
                    Console.CancelKeyPress += (_, e) => { e.Cancel = true; };
                    try
                    {
                        while (true)
                        {
                            Log.Debug(  "waiting");
                            UpdateSubscriptions(consumer);
                            try
                            {
                                var consumeResult = consumer.Consume(5000);
                                if (consumeResult != null)
                                {
                                    Log.Debug(  "Received message: " + consumeResult.Message.Value);
                                    HandleConsumeResult(consumeResult);
                                }

                            }
                            catch (ConsumeException e)
                            {
                                Log.Error(  "Error occured while consuming: {error}", e.Error.Reason);
                            }
                            catch (JsonReaderException e)
                            {
                                Log.Error(  "Error occured while interpreting json: {error}", e.Message);
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
    }
}
