using System.Text.Json;
using MiddlewareManager.DataModel;
using MiddlewareManager.Protocols;
using Newtonsoft.Json;

namespace MiddlewareManager.Protocols;

public static class OPCUA
{
    public static IConnectionDetails CreateOPCUAIngressConnection(string id, IngressDTOBase value)
    {
        return new OPCUAConnectionDetails
        {
            ID = id,
            PROTOCOL = value.protocol,
            PARAMETERS = new ParameterDetails
            {
                SERVER_URL = value.host,
                TRANSMISSION_PAIRS = JsonConvert.SerializeObject(new object[]
                {
                    new
                    {
                        NODE_NAME = $"{value.nodeId}",
                        VALUE_TYPE = $"{value.dataFormat}",
                        ORIGIN_TOPIC = $"{value.topic}"
                    }
                }),
                DATA_FORMAT = value.dataFormat,
            }
        };
    }

    public static IConnectionDetails CreateOPCUAEgressConnection(string id, CreateEgressDto value,
        TransmissionDetails transmissionDetails)
    {
        return new OPCUAConnectionDetails
        {
            ID = id,
            PROTOCOL = value.protocol,
            PARAMETERS = new ParameterDetails
            {
                SERVER_URL = DetailsGenerator.GenerateHost(),
            },
            TRANSMISSION_DETAILS = transmissionDetails
        };
    }
}

public class OPCUAConnectionDetails : IConnectionDetails
{
    public string SERVER_URL { get; set; }

    public string? TRANSMISSION_PAIRS { get; set; }
    public string? FREQUENCY { get; set; }

    public string? CHANGED_FREQUENCY { get; set; }

    public string? DATA_FORMAT { get; set; }

    public Dictionary<string, JsonElement>? METADATA { get; set; }

    public string ID { get; set; }
    public string PROTOCOL { get; set; }
    public object PARAMETERS { get; set; }
    public TransmissionDetails TRANSMISSION_DETAILS { get; set; }
}