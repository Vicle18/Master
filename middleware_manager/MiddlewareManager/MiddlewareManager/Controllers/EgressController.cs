using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MiddlewareManager.DataModel;
using MiddlewareManager.Protocols;
using MiddlewareManager.Repositories;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Serilog;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace MiddlewareManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EgressController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogger<IngressController> _logger;
        private readonly IEgressRepository _egressRepo;
        private readonly HttpClient _client;
        private List<string> _connectionDetails;


        public EgressController(IConfiguration config, ILogger<IngressController> logger,
            IEgressRepository egressRepo)
        {
            _config = config;
            _logger = logger;
            _egressRepo = egressRepo;
            _connectionDetails = new List<string>();
            _client = new HttpClient();
            _logger.LogDebug("starting {controller}", "IngressController");
        }


        // GET: api/Egress
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Egress/5
        [HttpGet("{id}", Name = "GetEgress")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Egress
        [HttpPost]
        public async Task<ActionResult<CreateObservablePropertiesResult>> Post([FromBody] CreateEgressDto value)
        {
            Log.Debug("test");
            Log.Debug(JsonSerializer.Serialize(value));
            try
            {
                Response response = null;
                var id = Guid.NewGuid().ToString();

                var topicName = $"{value.name}-{Guid.NewGuid().ToString()}";
                var egressGroupId = Guid.NewGuid();
                List<ObservableProperty> observableProperties = await _egressRepo.getIngressProperties(value.ingressIds);
                foreach (var observableProperty in observableProperties)
                {
                    Log.Debug(JsonSerializer.Serialize(observableProperty));
                    var connectionDetails = ConnectionDetailsFactory.Create(id, value, topicName, observableProperty);
                    _connectionDetails.Add(JsonSerializer.Serialize(connectionDetails));
                    await ForwardsRequestToConfigurator(value, topicName, JsonSerializer.Serialize(connectionDetails));
                }
                response = await _egressRepo.CreateEgressEndpoint(id, value,
                    _connectionDetails, observableProperties, egressGroupId.ToString());
                
                return Ok(response);
            }
            catch (ArgumentException e)
            {
                _logger.LogError(e, "got error: {message}", e.Message);
                return BadRequest(e.Message);
            }
        }

        /**
         * Creates an HTTP request to the ServiceConfigurator
         */
        private async Task ForwardsRequestToConfigurator(CreateEgressDto value, string topicName,
            string connectionDetails)
        {
            try
            {
                // Create the HTTP request message with the JSON string as the content
                var request = new HttpRequestMessage(HttpMethod.Post, "https://localhost:7033/api/Egress?=");
                var contentObject = new JObject()
                {
                    ["CreateBroker"] = value.createBroker,
                    ["ConnectionDetails"] = JsonConvert.DeserializeObject<JToken>(connectionDetails)
                };
                _logger.LogDebug("connectionDetails: {details}", contentObject.ToString());
                Console.WriteLine($"connectionDetails: {contentObject.ToString()}");
                //request.Content = new StringContent(connectionDetails, Encoding.UTF8, "application/json");
                request.Content = new StringContent(contentObject.ToString(), Encoding.UTF8, "application/json");
                // Send the request and wait for the response
                var response = await _client.SendAsync(request);

                // Get the response content
                var responseString = await response.Content.ReadAsStringAsync();
                _logger.LogDebug("Received ServiceConfigurator Response: {responseString}", responseString);

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw new ArgumentException($"Could not forward request: {e.Message}", e);
            }
            
        }

        // PUT: api/Egress/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/Egress/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<CreateObservablePropertiesResult>> Delete(string id)
        {
            _logger.LogDebug("deleting ingress with id: {id}", id);
            try
            {
                var database_response = await _egressRepo.DeleteEgressEndpoint(id);
                var _baseAddress = "https://localhost:7033";
                var request = new HttpRequestMessage(HttpMethod.Delete, $"{_baseAddress}/api/Ingress/{id}");
                var response = await _client.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    throw new HttpRequestException($"HTTP error {response.StatusCode}");
                }
                return Ok(response);
            }
            catch (ArgumentException e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}