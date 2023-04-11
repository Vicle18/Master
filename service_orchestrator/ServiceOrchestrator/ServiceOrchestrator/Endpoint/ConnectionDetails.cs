namespace ServiceOrchestrator.Endpoint;

public class ConnectionDetails
{
    public string Id { get; set; }
    public string Protocol { get; set; }
    public Dictionary<string, string> Parameters { get; set; }
}