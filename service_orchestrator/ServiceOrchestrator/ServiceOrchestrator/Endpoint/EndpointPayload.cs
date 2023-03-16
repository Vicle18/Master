namespace ServiceOrchestrator.Endpoint;

public class EndpointPayload
{
    public string Protocol { get; set; }
    public Dictionary<string, string> Parameters { get; set; }
}
