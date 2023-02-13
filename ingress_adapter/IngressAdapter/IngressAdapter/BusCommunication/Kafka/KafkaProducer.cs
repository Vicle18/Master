using Confluent.Kafka;
using Serilog;

namespace IngressAdapter.BusCommunication.KAFKA
{
    public class KafkaProducer : IKafkaProducer
    {
        private readonly string _host;
        private readonly string _port;
        private ProducerConfig producerConfig;
        private IProducer<Null, string> producer;
        public KafkaProducer(string host, string port)
        {
            _host = host;
            _port = port;
            producerConfig = new ProducerConfig { BootstrapServers = $"{_host}:{_port}",
                };
            Log.Debug(  $"{_host}:{_port}");
            producer = new ProducerBuilder<Null, string>(producerConfig).Build();
        }

        public void ProduceMessage(string topic, string message)
        {
            try
            {
                producer.Produce(topic, new Message<Null, string> { Value = message }, handler);
            }
            catch (ProduceException<Null, string> e)
            {
                Log.Error( "Delivery to topics {topics} failed: {error}", string.Join(", ", topic), e.Error.Reason);
            }
        }

        private void handler(DeliveryReport<Null, string> r)
        {
            if (!r.Error.IsError)
            {
                Log.Debug( "Delivered message to {topic}", r.TopicPartitionOffset);
            }
            else
            {
                Log.Error( "Delivery Error: {error}", r.Error.Reason);
            }
        }

    }
}
