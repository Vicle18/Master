using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Confluent.Kafka;
using GenericAAS.DataModel;
using I4ToolchainDotnetCore.Logging;
using JsonLD.Core;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace GenericAAS.BusCommunication.KAFKA
{
    public class KafkaClient : IBusClient
    {
        private string _host;
        private string _port;
        private string _groupId;
        private IKafkaProducer producer;
        private IKafkaReceiver receiver;
        private readonly II4Logger _log;
        private readonly IBusMessageBuilder _msgBuilder;
        private string standartTopic;
        private Dictionary<string, Action<DataPoint>> responseSubscriptions;


        public KafkaClient(JObject config, II4Logger log, IBusMessageBuilder msgBuilder)
        {
            _host = ExtractString("host", config);
            _port = ExtractString("port", config);
            _groupId = Guid.NewGuid().ToString();
            _log = log;
            _msgBuilder = msgBuilder;
            responseSubscriptions = new Dictionary<string, Action<DataPoint>>();
            standartTopic = "DEFAULT_STATUS";
            producer = new KafkaProducer(_host, _port, log);
            receiver = new KafkaMultiThreadReceiver(_host, _port, _groupId, log, producer);
            
        }
        
        private string ExtractString(string key, JObject config)
        {
            if (config.TryGetValue(key, out JToken hostToken)) return hostToken.Value<string>();
            throw new ArgumentException($"Could not find value: {key} in configuration");
        }
        

        public void AddSubscription(string topic, Action<string, ReceivedBusMessage> msgHandler)
        {
            receiver.AddSubscription(topic, msgHandler);
        }

        public void SetStatusTopic(string topic)
        {
            this.standartTopic = topic;
        }

        public void Initialise()
        {
            var cts = new CancellationTokenSource();
            
            Task task = Task.Run(async () =>
            {
                _log.LogDebug(GetType(),$"Starting kafka receiver");
                await receiver.Run();
                _log.LogDebug(GetType(),$"Stopping kafka receiver");

            }, cts.Token);
            
        }
        
        /// <summary>
        /// This is a temporary experiment of creating a better way for requesting files using
        /// async and a new kafka client for each request
        /// </summary>
        /// <param name="topic"></param>
        /// <param name="id"></param>
        /// <param name="HandleResponse"></param>
        public async Task<DataPoint> RequestFile(REQUEST_TYPE type, string topic, string id, Action<DataPoint> HandleResponse, int timeoutMilliseconds)
        {
            _log.LogDebug(GetType(), "requesting file {fileId} on topic {topic}", id, topic);
            DataPoint response = new DataPoint();
            var requestId = Guid.NewGuid();
            var responseTopic = "response_topic";
            var conf = new ConsumerConfig
            {
                GroupId = "requester_"+Guid.NewGuid().ToString(),
                BootstrapServers = _host + ":" + _port,
                AutoOffsetReset = AutoOffsetReset.Latest,
            };
            _log.LogDebug(GetType(), "subscribed to {topic}", topic);
            var cts = new CancellationTokenSource();
            try
            {
                Task task = Task.Run(() =>
                {
                    using (var consumer = new ConsumerBuilder<Ignore, string>(conf).Build())
                    {
                        consumer.Subscribe(responseTopic);
                        Console.CancelKeyPress += (_, e) =>
                        {
                            e.Cancel = true; // prevent the process from terminating.
                            cts.Cancel();
                        };
                        var request = _msgBuilder
                            .SetType(type == REQUEST_TYPE.FILE ? "file_request" : "config_request")
                            .SetTargetId("GENERIC_DB")
                            .AddStringParameter("id", id)
                            .AddStringParameter("response_topic", responseTopic)
                            .Build(requestId);
                        ProduceMessage(topic, request);
                        try
                        {
                            var startTime = DateTime.Now;
                            while (DateTime.Now.Subtract(startTime).TotalMilliseconds < timeoutMilliseconds)
                            {

                                try
                                {
                                    if (cts.Token.IsCancellationRequested)
                                        throw new OperationCanceledException("cancelled externally");
                                    var consumeResult = consumer.Consume(100);
                                    if (consumeResult == null) continue;
                                    var msgContent = JObject.Parse(consumeResult.Message.Value);
                                    _log.LogDebug(GetType(),
                                        $"Received Message from Kafka: {consumeResult.Message.Value}");
                                    var responseId = msgContent["requestId"]?.ToString();
                                    if (responseId == requestId.ToString())
                                    {
                                        _log.LogDebug(GetType(), "found a match for {id}", responseId);
                                        var dataPoint = JsonConvert.DeserializeObject<DataPoint>(
                                            msgContent["response"]?.ToString() ??
                                            throw new InvalidOperationException("Could not find a response"));
                                        response = dataPoint;
                                        break;
                                    }
                                }
                                catch (ConsumeException e)
                                {
                                    _log.LogError(GetType(), "Error occured: {error}", e.Message);
                                }
                            }

                            if (DateTime.Now.Subtract(startTime).TotalMilliseconds > timeoutMilliseconds)
                            {
                                throw new ArgumentException($"Timeout reached for request with file id: {id}");
                            }
                        }
                        catch (OperationCanceledException e)
                        {
                            // Ensure the consumer leaves the group cleanly and final offsets are committed.
                            consumer.Close();
                        }
                        catch (InvalidOperationException e)
                        {
                            consumer.Close();
                            throw new ArgumentException($"Error when handling response file -> {e.Message}");
                        }
                        catch (ArgumentException e)
                        {
                            consumer.Close();
                            throw new ArgumentException($"Error when waiting for response file -> {e.Message}");
                        }
                    }
                }, cts.Token);
                await task.ContinueWith(t =>
                {
                    foreach (var ex in t.Exception!.InnerExceptions)
                    {
                        _log.LogError(GetType(), ex.Message);
                        throw ex;
                    }
                }, TaskContinuationOptions.OnlyOnFaulted);
                
            }
            catch (ArgumentException e)
            {
                throw new ArgumentException($"Error in file request -> {e.Message}");
            }
            catch (TaskCanceledException e)
            {
                // task is cancelled in the exception handling task, if better way is known, please implement
            }


            return response;
        }

        public void ProduceMessage(string topic, JObject content)
        {
            producer.ProduceMessage(topic, content);
        }

        public void ProduceMessageToStandardTopic(JObject content)
        {
            producer.ProduceMessage(standartTopic, content);
        }

        public void RemoveSubscription(string topic)
        {
            throw new NotImplementedException();
        }
    }
}

