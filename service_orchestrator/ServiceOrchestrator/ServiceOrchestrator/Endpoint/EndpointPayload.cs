namespace ServiceOrchestrator.Endpoint;

public class EndpointPayload
{
    public string Id { get; set; }
    public string Protocol { get; set; }
    public Dictionary<string, string> Parameters { get; set; }
}
