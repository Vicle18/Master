using System.Text.Json;
using MiddlewareManager.DataModel;
using Serilog;

namespace MiddlewareManager.Protocols
{
    public static class RTDE
    {
        public static IConnectionDetails CreateRTDEIngressConnection(string id, IngressDTOBase value, string topicName, TransmissionDetails transmissionDetails)
        {
            return new RTDEConnectionDetails
            {
                ID = id,
                PROTOCOL = value.protocol,
                PARAMETERS = new ParameterDetails
                {
                    HOST = value.host,
                    PORT = value.port.ToString(),
                    OUTPUT = value.output
                },
                TRANSMISSION_DETAILS = transmissionDetails
            };
        }

        public static IConnectionDetails CreateRTDEEgressConnection(string id, CreateEgressDto value,
            TransmissionDetails transmissionDetails)
        {
            return new RTDEConnectionDetails
            {
                ID = id,
                PROTOCOL = value.protocol,
                PARAMETERS = new ParameterDetails()
                {
                    HOST = value.host,
                    PORT = value.port,
                    
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

    }
}