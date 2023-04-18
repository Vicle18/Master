using System.Text.Json;

namespace MiddlewareManager.Protocols;

public class OPCUAConnectionDetails : IConnectionDetails
{
    public string ID { get; set; }
    public string PROTOCOL { get; set; }
    public OPCUAParameters PARAMETERS { get; set; }
    public TransmissionDetails TRANSMISSION_DETAILS { get; set; }
    object IConnectionDetails.PARAMETERS { get => PARAMETERS; set => PARAMETERS = (OPCUAParameters)value; }
}

public class OPCUAParameters
{
    public string SERVER_URL { get; set; }
    
}