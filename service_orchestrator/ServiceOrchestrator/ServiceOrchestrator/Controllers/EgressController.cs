using System;
using System.Collections.Generic;
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
using ServiceOrchestrator.Endpoint;
using ServiceOrchestrator.Protocols;

namespace ServiceOrchestrator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EgressController : ControllerBase
    {
        private readonly ILogger<IngressController> _logger;
        private readonly IContainerManager _containerManager;
        private readonly IEnvVarCreator _envVarCreator;
        private readonly ContainerConfig _containerConfig;

        public EgressController(ILogger<IngressController> logger, IContainerManager containerManager, IEnvVarCreator envVarCreator)
        {
            _logger = logger;
            _containerManager = containerManager;
            _envVarCreator = envVarCreator;
        }

        // GET: api/Egress
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1Egress", "value2Egress" };
        }

        // GET: api/Egress/5
        [HttpGet("{id}", Name = "GetEgress")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Egress
        [HttpPost]
        public async Task Post([FromBody] EndpointPayload data)
        {
            Log.Debug("Inside egress post");
            ContainerConfig config = new ContainerConfig("clemme/egress:latest", new Dictionary<string, string>());
            config.EnvironmentVariables.AddRange(_envVarCreator.CreateEgressEnvVars(data));

            if (data.CreateBroker ?? false)
            {
                var host = await _containerManager.StartContainerBroker(data.ConnectionDetails.Id, config, data.ConnectionDetails.Protocol);
                config.EnvironmentVariables["EGRESS_CONFIG__PARAMETERS__HOST"] = host;
                config.EnvironmentVariables["EGRESS_CONFIG__PARAMETERS__PORT"] = "1883";
            }
            await _containerManager.StartContainer(data.ConnectionDetails.Id, config);
            
        }

        // PUT: api/Egress/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/Egress/5
        [HttpDelete("{id}")]
        public void Delete(string id)
        {
            _containerManager.StopContainer(id);
        }
    }
}