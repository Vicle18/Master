using Confluent.Kafka;
using Microsoft.Extensions.Configuration;
using Serilog;

namespace EgressAdapter.BusCommunication.KAFKA
{
    /// <summary>
    /// An Implementation of a kafka receiver, that creates a new consumer for each subscription. Good for handling multiple topics, where one or more
    /// receive a continuous stream of messages - not so good, if a lot of different topics are subscribed to.
    /// </summary>
    public class KafkaMultiThreadReceiver : IKafkaReceiver
    {
        private readonly IConfiguration _config;
        private Dictionary<string, CancellationTokenSource> topicSubCancellationTokenSources;
        private string _host;
        private string _port;
        private IKafkaProducer _producer;
        private string _groupId;

        public KafkaMultiThreadReceiver(string host, string port, string groupId, IKafkaProducer producer)
        {
            _host = host;
            _port = port;
            _groupId = groupId;
            _producer = producer;
            topicSubCancellationTokenSources = new Dictionary<string, CancellationTokenSource>();
        }

        public void AddSubscription(string topic, Action<string, string> msgHandler)
        {
            var conf = new ConsumerConfig
            {
                GroupId = _groupId,
                BootstrapServers = _host + ":" + _port,
                AutoOffsetReset = AutoOffsetReset.Earliest,
            };
            Log.Debug("subscribed to {topic}", topic);
            var cts = new CancellationTokenSource();
            Task task = Task.Run(() =>
            {
                Log.Debug("Executing Task {number}", 1);
                using (var consumer = new ConsumerBuilder<Ignore, string>(conf).Build())
                {
                    Log.Debug("Printing {Host} and {Port}", _host, _port);
                    consumer.Subscribe(topic);
                    Log.Debug("Executing Task {number}", 2);
                    Console.CancelKeyPress += (_, e) =>
                    {
                        e.Cancel = true; // prevent the process from terminating.
                        cts.Cancel();
                    };
                    try
                    {
                        _producer.ProduceMessage("test", "message");
                        Log.Debug("Executing Task {number}", 3);
                        while (true)
                        {
                            Log.Debug("Executing Task {number}", 4);
                            try
                            {
                                if (cts.Token.IsCancellationRequested)
                                    throw new OperationCanceledException("cancelled externally");
                                Log.Debug("Executing Task {number}", 5);

                                var consumeResult = consumer.Consume(CancellationToken.None);
                                Log.Debug("Executing Task {number}", 6);
                                Log.Debug($"Received Message from Kafka: {consumeResult.Message.Value}");
                                msgHandler(topic, consumeResult.Message.Value);
                                Log.Debug("Executing Task {number}", 7);
                            }
                            catch (ConsumeException e)
                            {
                                Log.Error("Error occured: {error}", e.Message);
                            }
                        }
                    }
                    catch (OperationCanceledException)
                    {
                        // Ensure the consumer leaves the group cleanly and final offsets are committed.
                        consumer.Close();
                    }
                }
            }, cts.Token);
        }

        public void RemoveSubscription(string topic)
        {
            if (topicSubCancellationTokenSources.ContainsKey(topic))
            {
                topicSubCancellationTokenSources.TryGetValue(topic, out var cts);
                cts.Cancel();
            }
            else
            {
                Log.Error("could not find subscription to topic {topic}", topic);
            }
        }

        public async Task Run()
        {
            await Task.Run(async () =>
            {
                var cts = new CancellationTokenSource();
                Console.CancelKeyPress += (_, e) =>
                {
                    e.Cancel = true; // prevent the process from terminating.
                    cts.Cancel();
                };
                while (!cts.Token.IsCancellationRequested)
                {
                    Task _currentExecution = Task.Delay(5000, cts.Token);
                    await _currentExecution.ContinueWith(task => { Log.Debug("Still running"); });
                }
            });
        }
    }
}