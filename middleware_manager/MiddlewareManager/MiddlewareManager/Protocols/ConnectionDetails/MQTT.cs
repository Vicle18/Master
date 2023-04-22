using System.Text.Json;
using MiddlewareManager.DataModel;

namespace MiddlewareManager.Protocols;

public static class MQTT
{
    public static IConnectionDetails CreateMqttIngressConnection(string id, IngressDTOBase ingressValue,
        string topicName)
    {
        return new MQTTConnectionDetails
        {
            ID = id,
            PROTOCOL = ingressValue.protocol,
            PARAMETERS = new ParameterDetails
            {
                HOST = ingressValue.host,
                PORT = ingressValue.port.ToString(),
                TRANSMISSION_PAIRS = $"{ingressValue.topic}:{topicName}",
                FREQUENCY = ingressValue.frequency.ToString(),
                CHANGED_FREQUENCY = ingressValue.changedFrequency.ToString() ?? ingressValue.frequency.ToString(),
                DATA_FORMAT = ingressValue.dataFormat,
                DATA_TYPE = ingressValue.dataType,
                DOWN_SAMPLING_METHOD = ingressValue.downsampleMethod
            }
        };
    }

    public static IConnectionDetails CreateMqttEgressConnection(string id, CreateEgressDto value,
        TransmissionDetails transmissionDetails)
    {
        return new MQTTConnectionDetails
        {
            ID = id,
            PROTOCOL = value.protocol,
            PARAMETERS = new ParameterDetails
            {
                HOST = value.host ?? DetailsGenerator.GenerateHost(),
                PORT = value.port.Length < 0 ? value.port.ToString() : DetailsGenerator.GeneratePort(),
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
    public Dictionary<string, JsonElement>? METADATA { get; set; }
}