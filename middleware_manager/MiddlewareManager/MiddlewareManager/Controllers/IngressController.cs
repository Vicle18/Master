using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.Newtonsoft;
using GraphQL.Client.Serializer.SystemTextJson;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MiddlewareManager.DataModel;
using MiddlewareManager.Repositories;
using Newtonsoft.Json.Linq;
using NuGet.Protocol;

namespace MiddlewareManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IngressController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogger<IngressController> _logger;
        private readonly IIngressRepository _ingressRepo;

        public IngressController(IConfiguration config, ILogger<IngressController> logger, IIngressRepository ingressRepo)
        {
            _config = config;
            _logger = logger;
            _ingressRepo = ingressRepo;
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
        public async Task<ActionResult<CreateObservablePropertiesResult>> Post([FromBody] CreateIngressDTO value)
        {
            _logger.LogDebug("creating ingress with values: {value}", value);
            try
            {
                var topicName = $"{value.name}-{Guid.NewGuid().ToString()}";
                var response = await _ingressRepo.CreateObservableProperty(value, topicName);
                // sending connectionDetails to the Service Configurator
                return Ok(response);
            }
            catch (ArgumentException e)
            {
                return BadRequest(e.Message);
            }
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
