using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NuGet.Packaging;
using Serilog;
using ServiceOrchestrator.ContainerManagement;
using ServiceOrchestrator.ContainerManagement.Kubernetes;
using ServiceOrchestrator.Endpoint;
using ServiceOrchestrator.Protocols;

namespace ServiceOrchestrator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IngressController : ControllerBase
    {
        private readonly ILogger<IngressController> _logger;
        private readonly IContainerManager _containerManager;
        private readonly IEnvVarCreator _envVarCreator;
        private readonly ContainerConfig _containerConfig;

        public IngressController(ILogger<IngressController> logger, IContainerManager containerManager, IEnvVarCreator envVarCreator)
        {
            _logger = logger;
            _containerManager = containerManager;
            _envVarCreator = envVarCreator;
        }

        // GET: api/Ingress
        [HttpGet]
        public IEnumerable<string> Get()
        {
            Log.Debug("Inside get");
            return new string[] { "value1Ingress", "value2Ingress" };
        }

        // GET: api/Ingress/5
        [HttpGet("{id}", Name = "GetIngress")]
        public string Get(int id)
        {
            var list = new List<string>() { };
            return "value";
        }

        // POST: api/Ingress
        [HttpPost]
        public void Post([FromBody] EndpointPayload data)
        {
            Log.Debug("Handling ingress payload, got {data}", JsonConvert.SerializeObject(data));

            ContainerConfig config = new ContainerConfig("clemme/ingress:latest", new Dictionary<string, string>());
            config.EnvironmentVariables.AddRange(_envVarCreator.CreateIngressEnvVars(data));
            if (data.CreateBroker?? false)
            {
                _logger.LogDebug("Creating new broker for {adapter}", "ingress");
            }
            _logger.LogDebug(config.ToString());
            _containerManager.StartContainer(data.ConnectionDetails.Id, config);
        }
        


        // PUT: api/Ingress/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/Ingress/5
        [HttpDelete("{id}")]
        public void Delete(string id)
        {
            _containerManager.StopContainer(id);
        }
    }
}