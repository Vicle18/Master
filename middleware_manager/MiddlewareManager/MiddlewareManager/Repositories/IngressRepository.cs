using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.SystemTextJson;
using MiddlewareManager.DataModel;
using Newtonsoft.Json;
using Serilog;
using JsonSerializer = System.Text.Json.JsonSerializer;

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

    public async Task<Response> CreateObservableProperty(string id, CreateIngressDtoBase value, string topicName,
        string connectionDetails)
    {
        
        var request = new GraphQLRequest
        {
            Query = @"
                            mutation Mutation($input: [ObservablePropertyCreateInput!]!) {
                              createObservableProperties(input: $input) {
                                observableProperties {
                                  name
                                  id
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
                        frequency = value.frequency,
                        id = id,
                        connectionDetails = connectionDetails,
                        dataFormat = value.dataFormat,
                        // changedFrequency = Int32.Parse(value.changedFrequency ?? value.frequency),
                        changedFrequency = value.frequency,

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
        Log.Debug("BEFORE SEND MUTATION");
        var response = await graphQLClient.SendMutationAsync<Response>(request);
        Log.Debug(JsonConvert.SerializeObject(response));
        _logger.LogCritical("when creating ingress, got feedback: {feedback}", response.Data);
        if (response.Errors != null)
        {
            throw new ArgumentException($"Failed in creating ObservableProperty, error: {response.Errors}");
        }

        return response.Data;
    }

    public async Task<string> DeleteObservableProperty(string id)
    {
        var request = new GraphQLRequest
        {
            Query = @"mutation Mutation($where: ObservablePropertyWhere) {
                        deleteObservableProperties(where: $where) {
                            nodesDeleted
                      }
                    }",
            Variables = new
            {
                where = new
                {
                    id = id
                }
            }
        };
        var response = await graphQLClient.SendMutationAsync<Object>(request);
        Log.Debug(JsonConvert.SerializeObject(response));
        _logger.LogCritical("when deleting ingress, got feedback: {feedback}", response.Data);
        if (response.Errors != null)
        {
            throw new ArgumentException($"Failed in creating ObservableProperty, error: {response.Errors}");
        }

        return JsonConvert.SerializeObject(response.Data);
    }

    public async Task<string> UpdateObservableProperty(UpdateIngressDto value)
    {
        Log.Debug("BEFORE UPDATING");
        Log.Debug(value.id);
        try
        {
            var request = new GraphQLRequest
            {
                Query = @"
                mutation UpdateObservableProperties($update: ObservablePropertyUpdateInput, $where: ObservablePropertyWhere) {
                  updateObservableProperties(update: $update, where: $where) {
                    observableProperties {
                      id
                    }
                  }
                }
            ",
                Variables = new
                {
                    update = new
                    {
                        name = value.name,
                        frequency = value.frequency,
                        description = value.description,
                        dataFormat = value.dataFormat,
                        changedFrequency = value.changedFrequency,
                        
                    },
                    where = new
                    {
                        id = value.id
                    }
                },
            };
            Log.Debug(JsonSerializer.Serialize(request));
            var response = await graphQLClient.SendMutationAsync<Object>(request);
        }
        catch (Exception e)
        {
            Console.Error.WriteLine($"An error occurred: {e.Message}");
        }

        Log.Debug("Response:");
        //Log.Debug(JsonSerializer.Serialize(response));
        return null;
    }
}