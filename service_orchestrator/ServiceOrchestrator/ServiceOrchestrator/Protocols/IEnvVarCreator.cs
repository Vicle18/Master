using ServiceOrchestrator.Endpoint;

namespace ServiceOrchestrator.Protocols;

public interface IEnvVarCreator
{
    public Dictionary<string, string> CreateIngressEnvVars(EndpointPayload data);
    public Dictionary<string, string> CreateEgressEnvVars(EndpointPayload data);

}