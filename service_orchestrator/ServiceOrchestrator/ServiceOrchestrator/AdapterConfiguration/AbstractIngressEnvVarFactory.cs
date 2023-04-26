using NuGet.Packaging;
using ServiceOrchestrator.Endpoint;

namespace ServiceOrchestrator.Protocols;

public abstract class AbstractIngressEnvVarFactory
{
    private readonly IConfiguration _config;

    protected AbstractIngressEnvVarFactory(IConfiguration config)
    {
        _config = config;
    }

    public Dictionary<string, string> CreateEnvironmentVariables(EndpointPayload data)
    {
        var variables = new Dictionary<string, string>();
        variables.Add("ID", data.ConnectionDetails.Id);
        variables.Add("DOTNET_ENVIRONMENT", "Production");
        variables.Add("INGRESS_CONFIG__PROTOCOL", data.ConnectionDetails.Protocol);
        variables.Add("INGRESS_CONFIG__TRANSMISSION_DETAILS__TARGET_TOPIC", data.ConnectionDetails.Transmission_Details!["TARGET_TOPIC"].GetString()!);
        variables.Add("INGRESS_CONFIG__TRANSMISSION_DETAILS__FREQUENCY", data.ConnectionDetails.Transmission_Details!["FREQUENCY"].GetString()!);
        variables.Add("INGRESS_CONFIG__TRANSMISSION_DETAILS__CHANGED_FREQUENCY", data.ConnectionDetails.Transmission_Details!["CHANGED_FREQUENCY"].GetString()!);
        variables.Add("INGRESS_CONFIG__TRANSMISSION_DETAILS__DOWN_SAMPLING_METHOD", data.ConnectionDetails.Transmission_Details!["DOWN_SAMPLING_METHOD"].GetString()!);
        variables.Add("INGRESS_CONFIG__TRANSMISSION_DETAILS__DATA_TYPE", data.ConnectionDetails.Transmission_Details!["DATA_TYPE"].GetString()!);
        variables.AddRange(CreateProtocolSpecificEnvironmentVariables(data));
        return variables;
    }

    protected abstract Dictionary<string, string> CreateProtocolSpecificEnvironmentVariables(EndpointPayload data);
}