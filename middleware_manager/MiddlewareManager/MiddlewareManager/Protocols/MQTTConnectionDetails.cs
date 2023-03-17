namespace MiddlewareManager.Protocols;

public class MQTTConnectionDetails : IConnectionDetails
{
    public string PROTOCOL { get; set; }
    public MQTTParameters PARAMETERS { get; set; }
    object IConnectionDetails.PARAMETERS { get => PARAMETERS; set => PARAMETERS = (MQTTParameters)value; }
}

public class MQTTParameters
{
    public string HOST { get; set; }
    public string PORT { get; set; }
    public string TRANSMISSION_PAIRS { get; set; }
}