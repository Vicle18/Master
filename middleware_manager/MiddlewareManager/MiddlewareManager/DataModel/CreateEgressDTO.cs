namespace MiddlewareManager.DataModel;

public class CreateEgressDto : CreateDTO
{
    public string name { get; set; }
    public string description { get; set; }
    public string protocol { get; set; }
    public string? host { get; set; }
    public string? port { get; set; }
    public string[] ingressNodes { get; set; }
    public string? nodeId { get; set; }
    public string dataFormat { get; set; }
}