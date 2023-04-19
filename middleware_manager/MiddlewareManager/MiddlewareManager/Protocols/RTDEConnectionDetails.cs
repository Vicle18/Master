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
    
    public string? TRANSMISSION_PAIRS { get; set; }
    public string? FREQUENCY { get; set; }

    public string? CHANGED_FREQUENCY { get; set; }

    public string? DATA_FORMAT { get; set; }

    public Dictionary<string, JsonElement>? METADATA { get; set; }



    
}