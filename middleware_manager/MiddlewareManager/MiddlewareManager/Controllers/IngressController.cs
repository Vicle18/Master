using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.Newtonsoft;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MiddlewareManager.DataModel;
using NuGet.Protocol;

namespace MiddlewareManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IngressController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogger<IngressController> _logger;

        public IngressController(IConfiguration config, ILogger<IngressController> logger)
        {
            _config = config;
            _logger = logger;
            _logger.LogDebug("starting {controller}", "IngressController");
            
        }
        // GET: api/Ingress
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Ingress/5
        [HttpGet("{id}", Name = "GetIngress")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Ingress
        [HttpPost]
        public async Task<ActionResult<CreateObservablePropertiesResponse>> Post([FromBody] CreateIngressDTO value)
        {
            _logger.LogDebug("creating ingress with values: {value}", value);
            var graphQLClient = new GraphQLHttpClient(new GraphQLHttpClientOptions
            {
                EndPoint = new Uri("http://localhost:4000")
            }, new NewtonsoftJsonSerializer());

            var topicName = $"{value.name}-{Guid.NewGuid().ToString()}";
            var request = new GraphQLRequest
            {
                Query = @"
                            mutation Mutation($input: [ObservablePropertyCreateInput!]!) {
                              createObservableProperties(input: $input) {
                                info {
                                  nodesCreated
                                  relationshipsCreated
                                }
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
                    input = new []
                    {
                        new 
                        {
                            name = value.name,
                            description = value.description,
                            frequency = Int32.Parse(value.frequency),
                            id = Guid.NewGuid().ToString(),
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
                            }
                        }
                    }
                }
            };
            var response = await graphQLClient.SendMutationAsync<Response>(request);
            _logger.LogCritical("when creating ingress, got feedback: {feedback}", response.Data);
            if (response.Errors != null)
            {
                return BadRequest(response.Errors);
            }
            return Ok(response.Data);
        }

        // PUT: api/Ingress/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/Ingress/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
