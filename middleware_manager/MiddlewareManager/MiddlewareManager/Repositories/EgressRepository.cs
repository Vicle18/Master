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
    
    public async Task<ObservableProperty> GetIngressProperty(string ingressName)
    {
        return await RequestObservableProperties(ingressName);
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

    public async Task<Response> CreateEgressEndpoint(string id, CreateEgressDto value, string connectionDetails)
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
                        id = id,
                        name = value.name,
                        description = value.description,
                        dataFormat = value.dataFormat,
                        frequency = value.frequency,
                        connectionDetails = connectionDetails,
                        changedFrequency = value.changedFrequency ?? value.frequency,
                        accessTo = new
                        {
                           connect = new
                           {
                               where = new
                               {
                                   node = new
                                   {
                                       id = value.ingressId
                                   }
                               }
                           }
                        },
                        egressGroup = new
                        {
                            connect = new []
                            {
                                new
                                {
                                    where = new
                                    {
                                        node = new
                                        {
                                            id = value.groupId
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        _logger.LogDebug("sending graphql: {request}", JsonConvert.SerializeObject(request));
        var response = await graphQLClient.SendMutationAsync<Response>(request);
        Log.Debug(JsonConvert.SerializeObject(response));
        _logger.LogCritical("when creating egress, got feedback: {feedback}", response.Data);
        return response.Data;
    }

    public async Task<string> DeleteEgressEndpoint(string id)
    {
        var request = new GraphQLRequest
        {
            Query = @"
                mutation DeleteEgressEndpoints($where: EgressEndpointWhere) {
                  deleteEgressEndpoints(where: $where) {
                    nodesDeleted
                  }
                }",
            Variables = new
            {
                where= new
                {
                    id = id
                }
            }
        };
        
        var response = await graphQLClient.SendMutationAsync<Object>(request);
        Log.Debug(JsonConvert.SerializeObject(response));
        _logger.LogCritical("when deleting egress, got feedback: {feedback}", response.Data);
        if (response.Errors != null)
        {
            throw new ArgumentException($"Failed in deleting egress, error: {response.Errors}");
        }

        return JsonConvert.SerializeObject(response.Data);
    }
    
    private Array ManageFrequencies(int[]? valueChangedFrequencies, int[] valueFreqencies)
    {
        Log.Debug(JsonSerializer.Serialize(valueChangedFrequencies));
        Log.Debug(JsonSerializer.Serialize(valueFreqencies));
        return valueChangedFrequencies.Zip(valueFreqencies, (changedFrequency, frequency) => changedFrequency == 0 ? frequency : changedFrequency).ToArray();

    }
}