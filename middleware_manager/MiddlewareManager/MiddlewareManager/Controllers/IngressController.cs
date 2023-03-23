using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.Newtonsoft;
using GraphQL.Client.Serializer.SystemTextJson;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MiddlewareManager.AdapterModel;
using MiddlewareManager.DataModel;
using MiddlewareManager.Protocols;
using MiddlewareManager.Repositories;
using NuGet.Protocol;
using Serilog;

namespace MiddlewareManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IngressController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogger<IngressController> _logger;
        private readonly IIngressRepository _ingressRepo;
        private readonly HttpClient _client;

        public IngressController(IConfiguration config, ILogger<IngressController> logger,
            IIngressRepository ingressRepo)
        {
            _config = config;
            _logger = logger;
            _ingressRepo = ingressRepo;
            _logger.LogDebug("starting {controller}", "IngressController");
            _client = new HttpClient();
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
        public async Task<ActionResult<CreateObservablePropertiesResult>> Post([FromBody] CreateIngressDto value)
        {
            _logger.LogDebug("creating ingress with values: {value}", value);
            try
            {
                var topicName = $"{value.name}-{Guid.NewGuid().ToString()}";
                var connectionDetails =
                    ConnectionDetailsFactory.Create(value, topicName);
                var response = await _ingressRepo.CreateObservableProperty(value, topicName,
                    JsonSerializer.Serialize(connectionDetails));

                await ForwardsRequestToConfigurator(value, topicName, JsonSerializer.Serialize(connectionDetails));

                //return Ok(response);
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
        private async Task ForwardsRequestToConfigurator(CreateIngressDto value, string topicName,
            string connectionDetails)
        {
            // Create the HTTP request message with the JSON string as the content
            var request = new HttpRequestMessage(HttpMethod.Post, "https://localhost:7033/api/Ingress?=");
            request.Content = new StringContent(connectionDetails, Encoding.UTF8, "application/json");

            // Send the request and wait for the response
            var response = await _client.SendAsync(request);

            // Get the response content
            var responseString = await response.Content.ReadAsStringAsync();
            _logger.LogDebug("Received ServiceConfigurator Response: {responseString}", responseString);
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