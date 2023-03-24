using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.SystemTextJson;
using Newtonsoft.Json;
using Serilog;

namespace DataExplorer.Repository;

public class TopicRepository : ITopicRepository
{
    private readonly IConfiguration _config;
    private readonly ILogger<TopicRepository> _logger;
    private GraphQLHttpClient graphQLClient;
    private Dictionary<string, string> observablePropertyTopicMapping;
    
    
    
    public TopicRepository(IConfiguration config, ILogger<TopicRepository> logger)
    {
        _config = config;
        
        _logger = logger;
        observablePropertyTopicMapping = new Dictionary<string, string>();
        _logger.LogDebug("starting {repository}", "IngressRepository");
        graphQLClient = new GraphQLHttpClient(new GraphQLHttpClientOptions
        {
            EndPoint = new Uri(_config.GetValue<string>("GRAPHQL_URL"))
        }, new SystemTextJsonSerializer());
    }

    private GraphQLRequest CreateRequest(string propertyId)
    {
        return new GraphQLRequest
        {
            Query = @"
                    query ObservableProperties($where: ObservablePropertyWhere) {
                        observableProperties(where: $where) {
                            topic {
                                name
                            }
                        }
                    }",
            Variables = new
            {
                where = new
                {
                    id = propertyId
                }
            }
        };
    }

    public async Task<string> GetTopic(string observablePropertyId)
    {
        if (observablePropertyTopicMapping.TryGetValue(observablePropertyId, out string topic))
        {
            return topic;
        }
        else
        {
            var request = CreateRequest(observablePropertyId);
            var response = await graphQLClient.SendQueryAsync<ObservablePropertiesResult>(request);
            Log.Debug("Retrieved: {obj}",JsonConvert.SerializeObject(response.Data.ObservableProperties));
            if (response.Errors != null)
            {
                throw new ArgumentException($"Failed in retrieving topic, error: {response.Errors}");
            }
            observablePropertyTopicMapping.Add(observablePropertyId, response.Data.ObservableProperties[0].topic.name);
            return response.Data.ObservableProperties[0].topic.name;
        }
    }
}