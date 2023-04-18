using System.Text.Json;

namespace MiddlewareManager.Protocols;

public class RTDEConnectionDetails : IConnectionDetails
{
    public string ID { get; set; }
    public string PROTOCOL { get; set; }
    public RTDEParameters PARAMETERS { get; set; }
    public TransmissionDetails TRANSMISSION_DETAILS { get; set; }
    object IConnectionDetails.PARAMETERS { get => PARAMETERS; set => PARAMETERS = (RTDEParameters)value; }
}

public class RTDEParameters
{
    public string HOST { get; set; }
    public string PORT { get; set; }
}