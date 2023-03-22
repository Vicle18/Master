using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.SystemTextJson;
using MiddlewareManager.DataModel;
using Serilog;

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

    public async Task<CreateEgressResponse> CreateObservableProperty(CreateEgressDTO value, string topicName,
        string connectionDetails)
    {
        foreach (var observableProperty in value.observables)
        {
            Log.Debug("INSIDE LOOP");
            Log.Debug(observableProperty.ToString());
            Log.Debug(topicName);
            var response = await CreateEgressObservable(value, connectionDetails, observableProperty);
            Log.Debug(response.ToString());
        }

        Log.Debug("SENDING THE REQUEST");

        return null;
    }

    private async Task<CreateEgressResponse> CreateEgressObservable(CreateEgressDTO value, string connectionDetails,
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
                        changedFrequency = observableProperty.changedFrequency != null ? observableProperty.changedFrequency : observableProperty.frequency,
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
        var graphQLResponse = await graphQLClient.SendMutationAsync<CreateEgressResponse>(request);

        return graphQLResponse.Data;
    }
}

public class CreateEgressResponse
{
}