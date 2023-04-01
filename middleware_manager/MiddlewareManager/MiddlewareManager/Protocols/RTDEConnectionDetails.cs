namespace MiddlewareManager.Protocols;

public class RTDEConnectionDetails : IConnectionDetails
{
    public string PROTOCOL { get; set; }
    public RTDEParameters PARAMETERS { get; set; }
    object IConnectionDetails.PARAMETERS { get => PARAMETERS; set => PARAMETERS = (RTDEParameters)value; }
}

public class RTDEParameters
{
    public string FREQUENCY { get; set; }
    public string CHANGED_FREQUENCY { get; set; }
    public string HOST { get; set; }
    public string PORT { get; set; }
    public string TRANSMISSION_PAIRS { get; set; }
}