namespace MiddlewareManager.DataModel;

public class CreateEgressGroupDTO
{
    public string? id { get; set; }
    public string name { get; set; }
    public string description { get; set; }
    public string[]? egressEndpointIds { get; set; }
}