using Confluent.Kafka;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Serilog;

namespace DataExplorer.BusCommunication.KAFKA
{
    public class KafkaClient : IBusClient
    {
        private readonly IConfiguration _config;
        private readonly ILogger<KafkaClient> _logger;
        private string _groupId;
        private IKafkaProducer producer;
        private IKafkaReceiver receiver;
        private KafkaConfiguration _kafkaConfig;

        public KafkaClient(IConfiguration config, ILogger<KafkaClient> logger)
        {
            _config = config;
            _logger = logger;
            _kafkaConfig = new KafkaConfiguration();
            _config.GetSection("BUS_CONFIG").GetSection("PARAMETERS").Bind(_kafkaConfig);
            Log.Debug("Received bus config: {config}", _kafkaConfig);
            _groupId = Guid.NewGuid().ToString();
            producer = new KafkaProducer(_kafkaConfig.HOST, _kafkaConfig.PORT);
            //receiver = new KafkaMultiThreadReceiver(_kafkaConfig.HOST, _kafkaConfig.PORT, _groupId, producer);
        }
        
        public void Initialize()
        {
            var cts = new CancellationTokenSource();
            
            Task task = Task.Run(async () =>
            {
                Log.Debug($"Starting kafka receiver");
                await receiver.Run();
                Log.Debug($"Stopping kafka receiver");

            }, cts.Token);
        }

        public void Publish(string topic, string message)
        {
            producer.ProduceMessage(topic, message);
        }

        public List<Message<Ignore, string>> GetLastMessagesAmount(string topic, int amount)
        {
            var messages = new List<Message<Ignore, string>>();
            var partitions = GetPartitionAmount(topic);
            if (partitions == 0) return messages;
            var conf = new ConsumerConfig
            {
                GroupId = _groupId,
                BootstrapServers = _kafkaConfig.HOST + ":" + _kafkaConfig.PORT,
                AutoOffsetReset = AutoOffsetReset.Latest,
                EnableAutoCommit = false
            };
            using (var consumer = new ConsumerBuilder<Ignore, string>(conf).Build())
            {
                var amountPerPartition = Convert.ToInt32(Math.Max(1, Math.Round((double) (amount / partitions))));
                for (int i = 0; i < partitions; i++)
                {
                    try
                    {
                        var partition = new TopicPartition(topic, i);
                        var watermarkOffsets = consumer.QueryWatermarkOffsets(partition, TimeSpan.FromSeconds(10));
                   
                        var lastTenOffset = watermarkOffsets.High < amountPerPartition ? 0 : watermarkOffsets.High - amountPerPartition ;
                    
                        var lastTenPartitionOffset = new TopicPartitionOffset(partition, lastTenOffset);
                        consumer.Assign(new List<TopicPartitionOffset> { lastTenPartitionOffset });
                        var cts = new CancellationTokenSource();
                        cts.CancelAfter(TimeSpan.FromSeconds(0.5));
                        while (true)
                        {
                            var result = consumer.Consume(cts.Token);
                            if (result.IsPartitionEOF)
                            {
                                break;
                            }
                            messages.Add(result.Message);
                            Console.WriteLine($"Consumed message '{result.Message.Value}' at offset {result.Offset}");
                        }
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                        
                    }
                    
                }
            }
            messages.Sort((m1, m2) => DateTime.Compare(m1.Timestamp.UtcDateTime, m2.Timestamp.UtcDateTime));
            return messages;
        }

        private int GetPartitionAmount(string topic)
        {
            var partitionAmount = 1;
            var config = new AdminClientConfig
            {
                BootstrapServers = _kafkaConfig.HOST + ":" + _kafkaConfig.PORT
            };
            
            using (var adminClient = new AdminClientBuilder(config).Build())
            {
                var metadata = adminClient.GetMetadata(topic, TimeSpan.FromSeconds(10));

                partitionAmount = metadata.Topics
                    .Single(t => t.Topic == topic)
                    .Partitions
                    .Count;
                
                Console.WriteLine($"The topic '{topic}' has {partitionAmount} partitions.");
            }

            return partitionAmount;
        }

        public List<Message<Ignore, string>> GetLastMessagesTimeSpan(string topic, int seconds)
        {
            var startTime = DateTime.Now - TimeSpan.FromSeconds(seconds);
            var messages = GetLastMessagesAmount(topic, 1000);
            var filtered = messages.FindAll(m => m.Timestamp.UtcDateTime > startTime);
            if(filtered.Count >= 1000) _logger.LogDebug("Reached the message limit of 1000");
            return filtered;
        }
    }
}

