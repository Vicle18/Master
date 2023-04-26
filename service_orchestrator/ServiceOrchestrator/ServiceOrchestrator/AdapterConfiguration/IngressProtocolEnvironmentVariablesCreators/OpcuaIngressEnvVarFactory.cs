using ServiceOrchestrator.Endpoint;

namespace ServiceOrchestrator.Protocols.IngressProtocolEnvironmentVariablesCreators;

public class OpcuaIngressEnvVarFactory : AbstractIngressEnvVarFactory
{
    public OpcuaIngressEnvVarFactory(IConfiguration config) : base(config)
    {
    }

    protected override Dictionary<string, string> CreateProtocolSpecificEnvironmentVariables(EndpointPayload data)
    {
        var protocolSpecificEnvironmentVariables = new Dictionary<string, string>();
        protocolSpecificEnvironmentVariables.Add("INGRESS_CONFIG__PARAMETERS__SERVER_URL", data.ConnectionDetails.Parameters["SERVER_URL"].GetString()!);
        protocolSpecificEnvironmentVariables.Add("INGRESS_CONFIG__PARAMETERS__NODE_NAME", data.ConnectionDetails.Parameters["NODE_NAME"].GetString()!);
        return protocolSpecificEnvironmentVariables;
    }
}