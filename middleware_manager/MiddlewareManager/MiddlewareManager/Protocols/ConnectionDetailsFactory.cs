namespace MiddlewareManager.Protocols;

public class ConnectionDetailsFactory
{
    public static IConnectionDetails Create(string protocol, string host, string port, string topic , string topicName)
    {
        switch (protocol)
        {
            case "MQTT":
                return new MQTTConnectionDetails
                {
                    PROTOCOL = protocol,
                    PARAMETERS = new MQTTParameters
                    {
                        HOST = host,
                        PORT = port,
                        TRANSMISSION_PAIRS = topic + ":" + topicName
                    }
                };
            case "OPCUA":
                return new OPCUAConnectionDetails
                {
                    PROTOCOL = protocol,
                    PARAMETERS = new OPCUAParameters
                    {
                        SERVERURL = host,
                        TRANSMISSION_PAIRS = topic + ":" + topicName
                    }
                };
            default:
                throw new ArgumentException("Unsupported protocol");
        }
    }
}