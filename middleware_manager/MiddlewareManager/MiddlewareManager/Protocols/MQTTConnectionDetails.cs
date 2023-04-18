using System.Text.Json;

namespace MiddlewareManager.Protocols;

public class MQTTConnectionDetails : IConnectionDetails
{
    public string ID { get; set; }
    public string PROTOCOL { get; set; }
    public MQTTParameters PARAMETERS { get; set; }
    public TransmissionDetails TRANSMISSION_DETAILS { get; set; }
    object IConnectionDetails.PARAMETERS { get => PARAMETERS; set => PARAMETERS = (MQTTParameters)value; }
}

public class MQTTParameters
{
    public string HOST { get; set; }
    public string PORT { get; set; }
    
    public string? TRANSMISSION_PAIRS { get; set; }
    public string? FREQUENCY { get; set; }

    public string? CHANGED_FREQUENCY { get; set; }

    public string? DATA_FORMAT { get; set; }

    public Dictionary<string, JsonElement>? METADATA { get; set; }

}