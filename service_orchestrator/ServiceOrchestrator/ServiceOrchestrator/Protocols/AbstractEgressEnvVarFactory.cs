using System.Text.Json;
using NuGet.Packaging;
using ServiceOrchestrator.Endpoint;

namespace ServiceOrchestrator.Protocols;

public abstract class AbstractEgressEnvVarFactory
{
    private readonly IConfiguration _config;

    protected AbstractEgressEnvVarFactory(IConfiguration config)
    {
        _config = config;
    }

    public Dictionary<string, string> CreateEnvironmentVariables(EndpointPayload data)
    {
        var variables = new Dictionary<string, string>();
        variables.Add("ID", data.ConnectionDetails.Id);
        variables.Add("DOTNET_ENVIRONMENT", "Production");
        variables.Add("EGRESS_CONFIG__PROTOCOL", data.ConnectionDetails.Protocol);
        variables.Add("EGRESS_CONFIG__TRANSMISSION_DETAILS__DATA_FORMAT", data.ConnectionDetails.Transmission_Details!["DATA_FORMAT"].GetString()!);
        variables.Add("EGRESS_CONFIG__TRANSMISSION_DETAILS__FREQUENCY", data.ConnectionDetails.Transmission_Details!["FREQUENCY"].GetString()!);
        variables.Add("EGRESS_CONFIG__TRANSMISSION_DETAILS__CHANGED_FREQUENCY", data.ConnectionDetails.Transmission_Details!["CHANGED_FREQUENCY"].GetString()!);
        variables.Add("EGRESS_CONFIG__TRANSMISSION_DETAILS__ORIGIN_TOPIC", data.ConnectionDetails.Transmission_Details!["ORIGIN_TOPIC"].GetString()!);
        variables.Add("EGRESS_CONFIG__TRANSMISSION_DETAILS__TARGET", data.ConnectionDetails.Transmission_Details!["TARGET"].GetString()!);
        variables.Add("EGRESS_CONFIG__TRANSMISSION_DETAILS__DOWN_SAMPLING_METHOD", data.ConnectionDetails.Transmission_Details!["DOWN_SAMPLING_METHOD"].GetString()!);
        
        if (data.ConnectionDetails.Transmission_Details["DATA_FORMAT"].GetString() == "WITH_METADATA")
        {
            var metadata = data.ConnectionDetails.Transmission_Details["METADATA"];
            foreach (JsonProperty property in metadata.EnumerateObject())
            {
                if (property.Name != "TIMESTAMP")
                {
                    variables.Add($"EGRESS_CONFIG__TRANSMISSION_DETAILS__METADATA__{property.Name.ToUpper()}", property.Value.ToString());

                }
            }
        }
        
        variables.AddRange(CreateProtocolSpecificEnvironmentVariables(data));
        return variables;
    }

    protected abstract Dictionary<string, string> CreateProtocolSpecificEnvironmentVariables(EndpointPayload data);
}