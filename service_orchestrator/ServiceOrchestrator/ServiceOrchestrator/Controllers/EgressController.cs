using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
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
        private readonly ContainerConfig _containerConfig;

        public EgressController(ILogger<IngressController> logger, IContainerManager containerManager)
        {
            _logger = logger;
            _containerManager = containerManager;
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

            if (data.Protocol == Protocol.MQTT.ToString())
            {
                config.EnvironmentVariables.Add("INGRESS_CONFIG__PARAMETER___HOST", data.Parameters["HOST"]);
                config.EnvironmentVariables.Add("INGRESS_CONFIG__PARAMETER___PORT", data.Parameters["PORT"]);
            }
            else if (data.Protocol == Protocol.OPCUA.ToString())
            {
                config.EnvironmentVariables.Add("INGRESS_CONFIG__PARAMETERS__SERVER_URL",
                    data.Parameters["SERVER_URL"]);
            }
            else if (data.Protocol == Protocol.REST.ToString())
            {
                Log.Error("REST IS NOT SUPPORTED YET");
            }
        }

        // POST: api/Egress
        /*[HttpPost]
        public void Post([FromBody] JObject data)
        {
            var value = data.ToString();
            Log.Debug(value);
        }*/

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