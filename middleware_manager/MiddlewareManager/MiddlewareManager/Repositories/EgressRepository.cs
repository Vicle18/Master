using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.SystemTextJson;
using MiddlewareManager.DataModel;
using Newtonsoft.Json;
using Serilog;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace MiddlewareManager.Repositories;

public class EgressRepository : IEgressRepository
{
    private readonly IConfiguration _config;
    private readonly ILogger<EgressRepository> _logger;
    private GraphQLHttpClient graphQLClient;

    public EgressRepository(IConfiguration config, ILogger<EgressRepository> logger)
    {
        _config = config;
        _logger = logger;
        _logger.LogDebug("starting {repository}", "EgressRepository");

        graphQLClient = new GraphQLHttpClient(new GraphQLHttpClientOptions
        {
            EndPoint = new Uri("http://localhost:4000")
        }, new SystemTextJsonSerializer());
    }


    public async Task<List<ObservableProperty>> getIngressProperties(string[] valueIngressNodes)
    {
        List<ObservableProperty> observableProperties = new List<ObservableProperty>();
        foreach (var ingressName in valueIngressNodes)
        {
            observableProperties.Add(await RequestObservableProperties(ingressName));
        }

        return observableProperties;
    }

    private async Task<ObservableProperty> RequestObservableProperties(string ingressId)
    {
        var query = @"
            query ObservableProperties($where: ObservablePropertyWhere) {
              observableProperties(where: $where) {
                id
                name
                topic {
                  name
                }
              }
            }";

        var variables = new { where = new { id = ingressId } };

        var request = new GraphQLRequest
        {
            Query = query,
            Variables = variables
        };
        Log.Debug("before Sendquery");
        var response = await graphQLClient.SendQueryAsync<ObservablePropertyResponse>(request);
        Log.Debug("after Sendquery");
        Log.Debug(JsonSerializer.Serialize(response.Data));

        List<ObservableProperty> observableProperties = response.Data.ObservableProperties;

        return observableProperties[0];
    }

    public async Task<Response> CreateEgressEndpoint(CreateEgressDto value, string connectionDetails,
        ObservableProperty observableProperty, string egressGroupId)
    {
        Log.Debug("BEFORE GRAPHQL REQUEST ");
        var request = new GraphQLRequest
        {
            Query = @"
                    mutation Mutation($input: [EgressEndpointCreateInput!]!) {
                      createEgressEndpoints(input: $input) {
                        egressEndpoints {
                          id
                          name
                          description
                          dataFormat
                          frequency
                          connectionDetails
                          changedFrequency
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
                        id = Guid.NewGuid().ToString(),
                        name = value.name,
                        description = value.description,
                        dataFormat = value.dataFormat,
                        frequency = observableProperty.frequency,
                        connectionDetails = connectionDetails,
                        changedFrequency = observableProperty.changedFrequency ?? observableProperty.frequency,
                        egressGroup = egressGroupId,
                        accessTo = new
                        {
                            connect = new[]
                            {
                                new
                                {
                                    where = new
                                    {
                                        node = new
                                        {
                                            id = observableProperty.id
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        var response = await graphQLClient.SendMutationAsync<Response>(request);
        Log.Debug(JsonConvert.SerializeObject(response));
        _logger.LogCritical("when creating ingress, got feedback: {feedback}", response.Data);
        return response.Data;
    }
}