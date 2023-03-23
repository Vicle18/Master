using System.Diagnostics;
using MiddlewareManager.DataModel;
using Newtonsoft.Json;
using Serilog;

namespace MiddlewareManager.Protocols;

public class ConnectionDetailsFactory
{
    public static IConnectionDetails Create(CreateIngressDTO value, string topicName)
    {
        switch (value.protocol)
        {
            case "MQTT":
                return new MQTTConnectionDetails
                {
                    PROTOCOL = value.protocol,
                    PARAMETERS = new MQTTParameters
                    {
                        HOST = value.host,
                        PORT = value.port,
                        TRANSMISSION_PAIRS = $"{value.topic}:{topicName}",
                    }
                };
            case "OPCUA":
                return new OPCUAConnectionDetails
                {
                    PROTOCOL = value.protocol,
                    PARAMETERS = new OPCUAParameters
                    {
                        SERVER_URL = value.host,
                        TRANSMISSION_PAIRS = JsonConvert.SerializeObject(new object[]
                        {
                            new
                            {
                                NODE_NAME = $"{value.nodeName}",
                                VALUE_TYPE = $"{value.dataFormat}",
                                ORIGIN_TOPIC = $"{value.topic}"
                            }
                        })
                    }
                };
            default:
                throw new ArgumentException("Unsupported protocol");
        }
    }
}