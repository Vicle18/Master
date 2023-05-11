using MiddlewareManager.DataModel;
using Serilog;

namespace MiddlewareManager.Protocols;

public class ConnectionDetailsFactory : IConnectionDetailsFactory
{

    public IConnectionDetails CreateIngress(string id, IngressDTOBase value, string topicName)
    {
        Log.Debug(value.ToString());
        var transmissionDetails = new TransmissionDetails()
        {
            FREQUENCY = value.frequency.ToString(),
            CHANGED_FREQUENCY = value.changedFrequency.ToString() ?? value.frequency.ToString(),
            DATA_FORMAT = value.dataFormat,
            TARGET_TOPIC = topicName,
            DOWN_SAMPLING_METHOD = value.downsampleMethod,
            DATA_TYPE = value.dataType
        };
        switch (value.protocol)
        {
            case "RTDE": return RTDE.CreateRTDEIngressConnection(id, value, topicName, transmissionDetails);
            case "MQTT": return MQTT.CreateMQTTIngressConnection(id, value, topicName, transmissionDetails);
            case "OPCUA": return OPCUA.CreateOPCUAIngressConnection(id, value, transmissionDetails);
            case "REST": return REST.CreateRESTIngressConnection(id, value, transmissionDetails);
            default:
                throw new ArgumentException("Unsupported protocol");
        }
    }


    public IConnectionDetails CreateEgress(string id, CreateEgressDto value, ObservableProperty property)
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