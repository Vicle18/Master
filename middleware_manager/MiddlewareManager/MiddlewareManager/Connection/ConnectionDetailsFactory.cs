using MiddlewareManager.DataModel;
using Serilog;

namespace MiddlewareManager.Protocols;

public class ConnectionDetailsFactory
{
    private static int counter = 0;

    public static IConnectionDetails Create(string id, IngressDTOBase value, string topicName)
    {
        Log.Debug(value.ToString());

        switch (value.protocol)
        {
            case "RTDE": return RTDE.CreateRTDEIngressConnection(id, value, topicName);
            case "MQTT": return MQTT.CreateMQTTIngressConnection(id, value, topicName);
            case "OPCUA": return OPCUA.CreateOPCUAIngressConnection(id, value);
            default:
                throw new ArgumentException("Unsupported protocol");
        }
    }


    public static IConnectionDetails Create(string id, CreateEgressDto value, ObservableProperty property)
    {
        Log.Debug("details");
        
        var transmissionDetails = new TransmissionDetails()
        {
            FREQUENCY = value.frequency.ToString(),
            CHANGED_FREQUENCY = value.changedFrequency.ToString() ?? value.frequency.ToString(),
            DATA_FORMAT = value.dataFormat,
            ORIGIN_TOPIC = property.topic.name,
            TARGET = DetailsGenerator.GenerateEgressTarget(value),
            DOWN_SAMPLING_METHOD = value.downSamplingMethod,
            METADATA = value.metadata
        };
        switch (value.protocol)
        {
            case "MQTT": return MQTT.CreateMQTTEgressConnection(id, value, transmissionDetails);
            case "RTDE": return RTDE.CreateRTDEEgressConnection(id, value, transmissionDetails);
            case "OPCUA": return OPCUA.CreateOPCUAEgressConnection(id, value, transmissionDetails);
            default:
                throw new ArgumentException("Unsupported protocol");
        }
    }
}