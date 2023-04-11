namespace MiddlewareManager.DataModel;

public class CreateEgressDto : CreateDTO
{
    public string name { get; set; }
    public string description { get; set; }
    public string protocol { get; set; }
    public int[] frequencies { get; set; }
    
    public int[]? changedFrequencies { get; set; }

    public string? host { get; set; }
    public string? port { get; set; }
    public string[] ingressIds { get; set; }
    public string? nodeId { get; set; }
    public bool createBroker { get; set; }
    public string dataFormat { get; set; }
}