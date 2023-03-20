using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
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
        private readonly ContainerConfig _containerConfig;

        public IngressController(ILogger<IngressController> logger, IContainerManager containerManager)
        {
            _logger = logger;
            _containerManager = containerManager;
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
            return "value";
        }

        // POST: api/Ingress
        [HttpPost]
        public void Post([FromBody] EndpointPayload data)
        {
            ContainerConfig config = new ContainerConfig("clemme/egress:latest", new Dictionary<string, string>());
            ManagePayload(data, config);

            _containerManager.StartContainer(config);
        }

        private static void ManagePayload(EndpointPayload data, ContainerConfig config)
        {
            config.EnvironmentVariables.Add("INGRESS_CONFIG__PROTOCOL", data.Protocol);
            config.EnvironmentVariables.Add("INGRESS_CONFIG__PARAMETER___TRANSMISSION_PAIRS",
                data.Parameters["TRANSMISSION_PAIRS"]);

            switch (data.Protocol)
            {
                case "MQTT":
                    config.EnvironmentVariables.Add("INGRESS_CONFIG__PARAMETER___HOST", data.Parameters["HOST"]);
                    config.EnvironmentVariables.Add("INGRESS_CONFIG__PARAMETER___PORT", data.Parameters["PORT"]);
                    break;
                case "OPCUA":
                    config.EnvironmentVariables.Add("INGRESS_CONFIG__PARAMETERS__SERVER_URL",
                        data.Parameters["SERVER_URL"]);
                    break;
                case "REST":
                    Log.Error("REST IS NOT SUPPORTED YET");
                    break;
                default:
                    throw new ArgumentException("Unsupported protocol");
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