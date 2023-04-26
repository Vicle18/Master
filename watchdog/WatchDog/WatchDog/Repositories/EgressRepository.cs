using System.Text.Json;
using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.SystemTextJson;
using Serilog;
using WatchDog.Models;
using WatchDog.Models.Responses;

namespace WatchDog.Repositories;

public class EgressRepository : IEgressRepository
{
    private readonly IConfiguration _config;
    private readonly ILogger<IngressRepository> _logger;
    private GraphQLHttpClient graphQLClient;
    private bool _hasErrorOccured = false;
    private IEgressRepository _egressRepositoryImplementation;

    public EgressRepository(IConfiguration config, ILogger<IngressRepository> logger)
    {
        _config = config;
        _logger = logger;
        graphQLClient = new GraphQLHttpClient(new GraphQLHttpClientOptions
        {
            EndPoint = new Uri(
                $"http://{_config.GetSection("METASTORE").GetValue<string>("HOST")}:{_config.GetSection("METASTORE").GetValue<string>("PORT")}")
        }, new SystemTextJsonSerializer());
    }

    public async Task<List<string>> getEgressEndpoints()
    {
        var request = new GraphQLRequest
        {
            Query = @"
            query EgressEndpoints {
                egressEndpoints {
                    id
                }
            }"
        };

        var response = await graphQLClient.SendQueryAsync<EgressEndpointResponse>(request);


        return response.Data.EgressEndpoints.Select(op => op.id).ToList();
    }

    public async Task<bool> updateEgressStatus(string id, string status, DateTime lastUpdatedAt,
        DateTime? lastMessageReceived)
    {
        _logger.Log(LogLevel.Debug,
            $"id {id}, status {status}, lastUpdatedAt {lastUpdatedAt}, lastMessageReceived {lastMessageReceived}");

        var mutation = new GraphQLRequest
        {
            Query = @"
                mutation Mutation($where: EgressEndpointWhere, $update: EgressEndpointUpdateInput) {
                    updateEgressEndpoints(where: $where, update: $update) {
                        egressEndpoints {
                            id
                            status
                            lastUpdatedAt
                        }
                    }
                }
            ",
            Variables = new
            {
                where = new
                {
                    id = $"{id}"
                },
                update = new
                {
                    status = $"{status}", lastUpdatedAt = $"{lastUpdatedAt}"
                }
            }
        };

        if (status == "error" && !_hasErrorOccured)
        {
            UpdateErrorAt(id, lastMessageReceived ?? lastUpdatedAt);
        }

        var response = await graphQLClient.SendMutationAsync<ObservableProperty>(mutation);
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
              mutation($where: EgressEndpointWhere, $update: EgressEndpointUpdateInput) {
                updateEgressEndpoints(where: $where, update: $update) {
                  egressEndpoints {
                    id
                    errorStateAt
                  }
                }
              }",
            Variables = variables
        };
        var response = await graphQLClient.SendMutationAsync<EgressEndpoint>(mutation);
        _hasErrorOccured = true;
    }
}