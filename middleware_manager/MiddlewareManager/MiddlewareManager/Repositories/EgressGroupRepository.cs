using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.SystemTextJson;
using MiddlewareManager.DataModel;
using Newtonsoft.Json;

namespace MiddlewareManager.Repositories;

public class EgressGroupRepository : IEgressGroupRepository
{
    private readonly IConfiguration _config;
    private readonly ILogger<EgressGroupRepository> _logger;
    private GraphQLHttpClient graphQLClient;

    public EgressGroupRepository(IConfiguration config, ILogger<EgressGroupRepository> logger)
    {
        _config = config;
        _logger = logger;
        var url = _config.GetValue<string>("METASTORE_URL");
        _logger.LogDebug("starting {repository}, with metastore url: {metaurl}", "EgressGroupRepository", url);

        graphQLClient = new GraphQLHttpClient(new GraphQLHttpClientOptions
        {
            EndPoint = new Uri(url)
        }, new SystemTextJsonSerializer());
    }
    
    public async Task<Response> CreateEgressGroup(string id, CreateEgressGroupDTO value)
    {
        
        var request = new GraphQLRequest
        {
            Query = @"
                    mutation Mutation($input: [EgressGroupCreateInput!]!) {
                        createEgressGroups(input: $input) {
                            egressGroups {
                                id
                            }
                        }
                    }
                    ",
            Variables = new
            {
                input = new[]
                {
                    new
                    {
                        id = id,
                        name = value.name,
                        description = value.description,
                        accessTo = new
                        {
                           connect = new []
                           {
                               new
                               {
                                   where = new
                                   {
                                       node = new
                                       {
                                           id_IN = value.egressEndpointIds
                                       }
                                   }
                               }
                           }
                        },
                    }
                }
            }
        };
        var response = await graphQLClient.SendMutationAsync<Response>(request);
        _logger.LogDebug(JsonConvert.SerializeObject(response));
        _logger.LogCritical("when creating egress, got feedback: {feedback}", response.Data);
        return response.Data;
    }
}