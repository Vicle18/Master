namespace ServiceOrchestrator.Endpoint;

public class EndpointPayload
{
    public bool CreateBroker { get; set; }
    public ConnectionDetails ConnectionDetails { get; set; }
}
