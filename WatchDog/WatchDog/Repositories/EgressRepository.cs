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

    public EgressRepository(IConfiguration config, ILogger<IngressRepository> logger)
    {
        _config = config;
        _logger = logger;
        graphQLClient = new GraphQLHttpClient(new GraphQLHttpClientOptions
        {
            EndPoint = new Uri("http://localhost:4000")
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

        Log.Debug("before sending egress request");
        var response = await graphQLClient.SendQueryAsync<EgressEndpointResponse>(request);
        Log.Debug(JsonSerializer.Serialize(response));
        if (response.Errors != null && response.Errors.Any())
        {
            // Handle errors here
        }

        Log.Debug(JsonSerializer.Serialize(response.Data));
        return response.Data.EgressEndpoints.Select(op => op.id).ToList();
    }

    public async Task<bool> updateEgressStatus(string id, bool active)
    {
        var mutation = new GraphQLRequest
        {
            Query = @"
                mutation Mutation($where: EgressEndpointWhere, $update: EgressEndpointUpdateInput) {
                    updateEgressEndpoints(where: $where, update: $update) {
                        egressEndpoints {
                            id
                            status
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
                    status = $"{active}"
                }
            }
        };
        var response = await graphQLClient.SendMutationAsync<EgressEndpoint>(mutation);
        Log.Debug(JsonSerializer.Serialize(response));
        return true;
    }
}