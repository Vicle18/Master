using System.Text.Json;
using MiddlewareManager.DataModel;
using Serilog;

namespace MiddlewareManager.Protocols
{
    public static class RTDE
    {
        public static IConnectionDetails CreateRTDEIngressConnection(string id, IngressDTOBase value, string topicName)
        {
            return new RTDEConnectionDetails
            {
                ID = id,
                PROTOCOL = value.protocol,
                PARAMETERS = new ParameterDetails
                {
                    HOST = value.host,
                    PORT = value.port.ToString(),
                    TRANSMISSION_PAIRS = $"{value.output}:{topicName}",
                    FREQUENCY = value.frequency.ToString(),
                    CHANGED_FREQUENCY = value.changedFrequency.ToString() ?? value.frequency.ToString(),
                    DATA_FORMAT = value.dataFormat,
                    DATA_TYPE = value.dataType,
                    DOWN_SAMPLING_METHOD = value.downsampleMethod
                }
            };
        }

        public static IConnectionDetails CreateRTDEEgressConnection(string id, CreateEgressDto value,
            TransmissionDetails transmissionDetails)
        {
            return new RTDEConnectionDetails
            {
                ID = id,
                PROTOCOL = value.protocol,
                PARAMETERS = new OPCUAParameters
                {
                    SERVER_URL = DetailsGenerator.GenerateHost(),
                },
                TRANSMISSION_DETAILS = transmissionDetails
            };
        }
    }

    public class RTDEConnectionDetails : IConnectionDetails
    {
        public string ID { get; set; }
        public string PROTOCOL { get; set; }
        public object PARAMETERS { get; set; }

        public TransmissionDetails TRANSMISSION_DETAILS { get; set; }

        public Dictionary<string, JsonElement>? METADATA { get; set; }
    }
}