using ServiceOrchestrator.Endpoint;

namespace ServiceOrchestrator.Protocols.EgressProtocolEnvironmentVariablesCreators;

public class OpcuaEgressEnvVarFactory : AbstractEgressEnvVarFactory
{
    public OpcuaEgressEnvVarFactory(IConfiguration config) : base(config)
    {
    }

    protected override Dictionary<string, string> CreateProtocolSpecificEnvironmentVariables(EndpointPayload data)
    {
        var protocolSpecificEnvironmentVariables = new Dictionary<string, string>();
        protocolSpecificEnvironmentVariables.Add("EGRESS_CONFIG__PARAMETERS__SERVER_URL", data.ConnectionDetails.Parameters["SERVER_URL"].GetString()!);
        return protocolSpecificEnvironmentVariables;
    }
}