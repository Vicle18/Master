using System;
using Confluent.Kafka;

namespace DotnetKafkaProducer
{
    class Program
    {
        static void Main(string[] args)
        {
            var config = new ProducerConfig { BootstrapServers = "kafka1:9092" };

            using (var producer = new ProducerBuilder<Null, string>(config).Build())
            {
                Console.WriteLine("A kafka message");

                while (true)
                {
                    try
                    {
                        var message = "message " + DateTime.Now;
                        var result = producer.ProduceAsync("example_topic", new Message<Null, string> { Value = message }).Result;

                        Console.WriteLine($"Message '{message}' sent to partition {result.Partition} with offset {result.Offset}");
                    }
                    catch (ProduceException<Null, string> e)
                    {
                        Console.WriteLine($"Delivery failed: {e.Error.Reason}");
                    }
                    System.Threading.Thread.Sleep(3000);
                }
            }
        }
    }
}