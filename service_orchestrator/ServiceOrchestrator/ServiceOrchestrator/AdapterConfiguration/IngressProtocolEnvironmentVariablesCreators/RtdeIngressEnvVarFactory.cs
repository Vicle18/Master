using ServiceOrchestrator.Endpoint;

namespace ServiceOrchestrator.Protocols.IngressProtocolEnvironmentVariablesCreators;

public class RtdeIngressEnvVarFactory : AbstractIngressEnvVarFactory
{
    public RtdeIngressEnvVarFactory(IConfiguration config) : base(config)
    {
    }

    protected override Dictionary<string, string> CreateProtocolSpecificEnvironmentVariables(EndpointPayload data)
    {
        var protocolSpecificEnvironmentVariables = new Dictionary<string, string>();
        protocolSpecificEnvironmentVariables.Add("INGRESS_CONFIG__PARAMETERS__HOST", data.ConnectionDetails.Parameters["HOST"].GetString()!);
        protocolSpecificEnvironmentVariables.Add("INGRESS_CONFIG__PARAMETERS__PORT", data.ConnectionDetails.Parameters["PORT"].GetString()!);
        protocolSpecificEnvironmentVariables.Add("INGRESS_CONFIG__PARAMETERS__OUTPUT", data.ConnectionDetails.Parameters["OUTPUT"].GetString()!);
        return protocolSpecificEnvironmentVariables;
    }
}