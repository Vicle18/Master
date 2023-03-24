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

    public async Task<Response> CreateObservableProperty(CreateEgressDto value, string topicName,
        string connectionDetails, ObservableProperty observableProperty)
    {
        Log.Debug(observableProperty.ToString());
        Log.Debug(topicName);
        var response = await CreateEgressObservable(value, connectionDetails, observableProperty);
        Log.Debug(response.ToString());


        return null;
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

    private async Task<ObservableProperty> RequestObservableProperties(string ingressName)
    {
        var query = @"
            query ObservableProperties($where: ObservablePropertyWhere) {
              observableProperties(where: $where) {
                id
                frequency
                dataFormat
                name
                topic {
                  id
                  name
                }
              }
            }";

        var variables = new { where = new { name = ingressName } };

        var request = new GraphQLRequest
        {
            Query = query,
            Variables = variables
        };

        var response = await graphQLClient.SendQueryAsync<ObservablePropertyResponse>(request);
        List<ObservableProperty> observableProperties = response.Data.ObservableProperties;

        return observableProperties[0];
    }

    private async Task<Response> CreateEgressObservable(CreateEgressDto value, string connectionDetails,
        ObservableProperty observableProperty)
    {
        Log.Debug("BEFORE GRAPHQL REQUEST ");
        var request = new GraphQLRequest
        {
            Query = @"
                    mutation Mutation($input: [ObservablePropertyCreateInput!]!) {
                      createObservableProperties(input: $input) {
                        observableProperties {
                          name
                          topic {
                            name
                          }
                        }
                      }
                    }",
            Variables = new
            {
                input = new[]
                {
                    new
                    {
                        name = value.name,
                        description = value.description,
                        id = Guid.NewGuid().ToString(),
                        connectionDetails = connectionDetails,
                        dataFormat = value.dataFormat,
                        frequency = observableProperty.frequency,
                        changedFrequency = observableProperty.changedFrequency != null
                            ? observableProperty.changedFrequency
                            : observableProperty.frequency,
                        topic = new
                        {
                            create = new
                            {
                                node = new
                                {
                                    name = observableProperty.topic.name,
                                    id = Guid.NewGuid().ToString(),
                                    description = "topic description"
                                }
                            }
                        },
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