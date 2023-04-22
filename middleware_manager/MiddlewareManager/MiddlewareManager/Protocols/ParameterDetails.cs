namespace MiddlewareManager.Protocols;

public class ParameterDetails
{
    public string FREQUENCY { get; set; }
    public string CHANGED_FREQUENCY { get; set; }
    public string DATA_FORMAT { get; set; }
    public string HOST { get; set; }
    public string PORT { get; set; }
    public string TRANSMISSION_PAIRS { get; set; }
    public string? DATA_TYPE { get; set; }
    public object DOWN_SAMPLING_METHOD { get; set; }

}