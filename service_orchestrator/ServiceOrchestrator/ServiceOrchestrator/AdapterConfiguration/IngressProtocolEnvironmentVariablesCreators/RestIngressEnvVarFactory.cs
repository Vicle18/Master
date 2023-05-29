using ServiceOrchestrator.Endpoint;

namespace ServiceOrchestrator.Protocols.IngressProtocolEnvironmentVariablesCreators;

public class RestIngressEnvVarFactory: AbstractIngressEnvVarFactory
{
    public RestIngressEnvVarFactory(IConfiguration config) : base(config)
    {
    }

    protected override Dictionary<string, string> CreateProtocolSpecificEnvironmentVariables(EndpointPayload data)
    {
        var protocolSpecificEnvironmentVariables = new Dictionary<string, string>();
        protocolSpecificEnvironmentVariables.Add("INGRESS_CONFIG__PARAMETERS__SERVER_URL", data.ConnectionDetails.Parameters["SERVER_URL"].GetString()!);
        return protocolSpecificEnvironmentVariables;    }
}