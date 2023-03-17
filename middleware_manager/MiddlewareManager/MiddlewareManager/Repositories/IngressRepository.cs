using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.SystemTextJson;
using MiddlewareManager.DataModel;

namespace MiddlewareManager.Repositories;

public class IngressRepository : IIngressRepository
{
    private readonly IConfiguration _config;
    private readonly ILogger<IngressRepository> _logger;
    private GraphQLHttpClient graphQLClient;

    public IngressRepository(IConfiguration config, ILogger<IngressRepository> logger)
    {
        _config = config;
        _logger = logger;
        _logger.LogDebug("starting {repository}", "IngressRepository");

        graphQLClient = new GraphQLHttpClient(new GraphQLHttpClientOptions
        {
            EndPoint = new Uri("http://localhost:4000")
        }, new SystemTextJsonSerializer());
    }

    public async Task<Response> CreateObservableProperty(CreateIngressDTO value, string topicName)
    {
        var request = new GraphQLRequest
        {
            Query = @"
                            mutation Mutation($input: [ObservablePropertyCreateInput!]!) {
                              createObservableProperties(input: $input) {
                                observableProperties {
                                  name
                                  propertyOf {
                                    ... on Machine {
                                      name
                                    }
                                  }
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
                        frequency = Int32.Parse(value.frequency),
                        id = Guid.NewGuid().ToString(),
                        connectionDetails = value.connectionDetails,
                        dataFormat = value.dataFormat,
                        changedFrequency = Int32.Parse(value.changedFrequency ?? value.frequency),
                        topic = new
                        {
                            create = new
                            {
                                node = new
                                {
                                    name = topicName,
                                    id = Guid.NewGuid().ToString(),
                                    description = "topic description"
                                }
                            }
                        },
                        propertyOf = new
                        {
                            connect = new
                            {
                                where = new
                                {
                                    node = new
                                    {
                                        name = value.containingElement
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        var response = await graphQLClient.SendMutationAsync<Response>(request);
        _logger.LogCritical("when creating ingress, got feedback: {feedback}", response.Data);
        if (response.Errors != null)
        {
            throw new ArgumentException($"Failed in creating ObservableProperty, error: {response.Errors}");
        }

        return response.Data;
    }
}