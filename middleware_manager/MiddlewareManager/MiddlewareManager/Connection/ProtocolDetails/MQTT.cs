using System.Text.Json;
using MiddlewareManager.DataModel;

namespace MiddlewareManager.Protocols;

public static class MQTT
{
    public static IConnectionDetails CreateMQTTIngressConnection(string id, IngressDTOBase ingressValue,
        string topicName, TransmissionDetails transmissionDetails)
    {
        return new MQTTConnectionDetails
        {
            ID = id,
            PROTOCOL = ingressValue.protocol,
            PARAMETERS = new ParameterDetails
            {
                HOST = ingressValue.host,
                PORT = ingressValue.port.ToString(),
                TOPIC = ingressValue.topic,
            },
            TRANSMISSION_DETAILS = transmissionDetails
        };
    }

    public static IConnectionDetails CreateMQTTEgressConnection(string id, CreateEgressDto value,
        TransmissionDetails transmissionDetails)
    {
        return new MQTTConnectionDetails
        {
            ID = id,
            PROTOCOL = value.protocol,
            PARAMETERS = new ParameterDetails
            {
                HOST = value.host ?? DetailsGenerator.GenerateHost(),
                PORT = value.port ?? DetailsGenerator.GeneratePort(),
            },
            TRANSMISSION_DETAILS = transmissionDetails
        };
    }
}

public class MQTTConnectionDetails : IConnectionDetails
{
    public string ID { get; set; }
    public string PROTOCOL { get; set; }
    public object PARAMETERS { get; set; }
    public TransmissionDetails TRANSMISSION_DETAILS { get; set; }
}