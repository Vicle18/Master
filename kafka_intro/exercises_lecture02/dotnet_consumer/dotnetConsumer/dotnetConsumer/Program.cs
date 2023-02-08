using System;
using Confluent.Kafka;

namespace KafkaConsumer
{
    class Program
    {
        static void Main(string[] args)
        {
            var config = new ConsumerConfig
            {
                BootstrapServers = "kafka1:9092",
                GroupId = "example-consumer-group",
                AutoOffsetReset = AutoOffsetReset.Earliest
            };

            using (var consumer = new ConsumerBuilder<Null, string>(config).Build())
            {
                consumer.Subscribe("example_topic");

                Console.WriteLine("Kafka Consumer is running...");

                while (true)
                {
                    try
                    {
                        var message = consumer.Consume();

                        Console.WriteLine($"Message received: '{message.Value}' from partition {message.Partition} with offset {message.Offset}");
                    }
                    catch (ConsumeException e)
                    {
                        Console.WriteLine($"Consumption failed: {e.Error.Reason}");
                    }
                }
            }
        }
    }
}