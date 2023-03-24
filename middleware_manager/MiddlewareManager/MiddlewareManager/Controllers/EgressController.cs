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
using System.Text.Json;
using Serilog;

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


        public EgressController(IConfiguration config, ILogger<IngressController> logger,
            IEgressRepository egressRepo)
        {
            _config = config;
            _logger = logger;
            _egressRepo = egressRepo;
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
            Log.Debug(value.ToString());
            try
            {
                Response response = null;
                var topicName = $"{value.name}-{Guid.NewGuid().ToString()}";
                Log.Debug("after topicName");

                List<ObservableProperty> observableProperties = await _egressRepo.getIngressProperties(value.ingressNodes);
                foreach (var observableProperty in observableProperties)
                {
           
                    var connectionDetails = ConnectionDetailsFactory.Create(value, topicName, observableProperty);
                    response = await _egressRepo.CreateObservableProperty(value, "topic",
                       JsonSerializer.Serialize(connectionDetails), observableProperty);
                    await ForwardsRequestToConfigurator(value, topicName, JsonSerializer.Serialize(connectionDetails));
                }
                
                return Ok(response);
            }
            catch (ArgumentException e)
            {
                return BadRequest(e.Message);
            }
        }

        /**
         * Creates an HTTP request to the ServiceConfigurator
         */
        private async Task ForwardsRequestToConfigurator(CreateEgressDto value, string topicName,
            string connectionDetails)
        {
            // Create the HTTP request message with the JSON string as the content
            var request = new HttpRequestMessage(HttpMethod.Post, "https://localhost:7033/api/Egress?=");
            request.Content = new StringContent(connectionDetails, Encoding.UTF8, "application/json");

            // Send the request and wait for the response
            var response = await _client.SendAsync(request);

            // Get the response content
            var responseString = await response.Content.ReadAsStringAsync();
            _logger.LogDebug("Received ServiceConfigurator Response: {responseString}", responseString);
        }

        // PUT: api/Egress/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/Egress/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}