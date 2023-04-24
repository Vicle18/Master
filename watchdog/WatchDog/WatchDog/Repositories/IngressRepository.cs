using System.Text.Json;
using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.SystemTextJson;
using Serilog;
using WatchDog.Models;
using WatchDog.Models.Responses;

namespace WatchDog.Repositories;

public class IngressRepository : IIngressRepository
{
    private readonly IConfiguration _config;
    private readonly ILogger<IngressRepository> _logger;
    private GraphQLHttpClient graphQLClient;
    private bool _hasErrorOccured = false;

    public IngressRepository(IConfiguration config, ILogger<IngressRepository> logger)
    {
        _config = config;
        _logger = logger;
        graphQLClient = new GraphQLHttpClient(new GraphQLHttpClientOptions
        {
            EndPoint = new Uri(
                $"http://{_config.GetSection("METASTORE").GetValue<string>("HOST")}:{_config.GetSection("METASTORE").GetValue<string>("PORT")}")
        }, new SystemTextJsonSerializer());
    }

    public async Task<List<string>> getObservableProperties()
    {
        Log.Debug("Before request");
        var request = new GraphQLRequest
        {
            Query = @"
            query ObservableProperties {
              observableProperties {
                topic {
                  name
                }
              }
            }
            "
        };

        Log.Debug("before sending request");
        var response = await graphQLClient.SendQueryAsync<ObservablePropertyResponse>(request);

        if (response.Errors != null && response.Errors.Any())
        {
            // Handle errors here
        }

        Log.Debug(JsonSerializer.Serialize(response.Data));
        return response.Data.ObservableProperties.Select(op => op.topic.name).ToList();
    }

    public async Task<bool> updateObservableStatus(string id, string status, DateTime lastUpdatedAt)
    {
        Log.Debug("Updating");
        var variables = new
        {
            where = new { id = $"{id}" },
            update = new { status = $"{status}", lastUpdatedAt = $"{lastUpdatedAt}" }
        };

        // Define the GraphQL mutation request
        var mutation = new GraphQLRequest
        {
            Query = @"mutation Mutation($where: ObservablePropertyWhere, $update: ObservablePropertyUpdateInput) {
                        updateObservableProperties(where: $where, update: $update) {
                            observableProperties {
                                id
                                status
                                lastUpdatedAt
                            }
                        }
                    }",
            Variables = variables
        };

        if (status == "error" && !_hasErrorOccured)
        {
            UpdateErrorAt(id, lastUpdatedAt);
        }

        var response = await graphQLClient.SendMutationAsync<ObservableProperty>(mutation);
        Log.Debug(JsonSerializer.Serialize(response));
        return true;
    }

    private async Task UpdateErrorAt(string id, DateTime lastUpdatedAt)
    {
        var variables = new
        {
            where = new { id = $"{id}" },
            update = new { errorStateAt = $"{lastUpdatedAt}" }
        };

        var mutation = new GraphQLRequest
        {
            Query = @"
              mutation($where: ObservablePropertyWhere, $update: ObservablePropertyUpdateInput) {
                updateObservableProperties(where: $where, update: $update) {
                  observableProperties {
                    id
                    errorStateAt
                  }
                }
              }",
            Variables = variables
        };
        var response = await graphQLClient.SendMutationAsync<ObservableProperty>(mutation);
        Log.Debug(JsonSerializer.Serialize(response));
        _hasErrorOccured = true;
    }
}