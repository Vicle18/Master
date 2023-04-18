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

}