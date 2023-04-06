﻿using Serilog;
using WatchDog.Models;

namespace WatchDog.BusCommunication.KAFKA
{
    public class KafkaClient : IBusClient
    {
        private readonly IConfiguration _config;
        private string _host;
        private string _port;
        private string _groupId;
        private IKafkaProducer producer;
        private IKafkaReceiver receiver;
        private KafkaConfiguration _kafkaConfig;

        public KafkaClient(IConfiguration config)
        {
            _config = config;
            _kafkaConfig = new KafkaConfiguration();
            _config.GetSection("BUS_CONFIG").GetSection("PARAMETERS").Bind(_kafkaConfig);
            Log.Debug("Received bus config: {config}", _kafkaConfig);
            _groupId = Guid.NewGuid().ToString();
            producer = new KafkaProducer(_kafkaConfig.HOST, _kafkaConfig.PORT);
            receiver = new KafkaMultiThreadReceiver(_kafkaConfig.HOST, _kafkaConfig.PORT, _groupId, producer);
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

        public void Subscribe(string topic, Action<string, ReceivedBusMessage> messageHandler)
        {
            Log.Debug(topic);
            Log.Debug(messageHandler.Method.ToString());

            receiver.AddSubscription(topic, messageHandler);
        }

        public void Publish(string topic, string message)
        {
            producer.ProduceMessage(topic, message);
        }
    }
}
