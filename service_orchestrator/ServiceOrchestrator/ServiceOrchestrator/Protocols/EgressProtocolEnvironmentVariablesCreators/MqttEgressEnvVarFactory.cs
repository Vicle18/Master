using ServiceOrchestrator.Endpoint;

namespace ServiceOrchestrator.Protocols.EgressProtocolEnvironmentVariablesCreators;

public class MqttEgressEnvVarFactory : AbstractEgressEnvVarFactory
{
    public MqttEgressEnvVarFactory(IConfiguration config) : base(config)
    {
    }

    protected override Dictionary<string, string> CreateProtocolSpecificEnvironmentVariables(EndpointPayload data)
    {
        var protocolSpecificEnvironmentVariables = new Dictionary<string, string>();
        protocolSpecificEnvironmentVariables.Add("EGRESS_CONFIG__PARAMETERS__HOST", data.ConnectionDetails.Parameters["HOST"].GetString()!);
        protocolSpecificEnvironmentVariables.Add("EGRESS_CONFIG__PARAMETERS__PORT", data.ConnectionDetails.Parameters["PORT"].GetString()!);
        return protocolSpecificEnvironmentVariables;
    }
}