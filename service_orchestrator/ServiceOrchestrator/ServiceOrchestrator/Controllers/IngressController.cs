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
            Log.Debug("Handling ingress payload, got {data}", JsonConvert.SerializeObject(data));

            ContainerConfig config = new ContainerConfig("clemme/ingress:latest", new Dictionary<string, string>());
            ManagePayload(data, config);
            if (data.CreateBroker)
            {
                _logger.LogDebug("Creating new broker for {adapter}", "ingress");
            }
            _logger.LogDebug(config.ToString());
            _containerManager.StartContainer(data.ConnectionDetails.Id, config);
        }

        private static void ManagePayload(EndpointPayload data, ContainerConfig config)
        {
            Log.Debug("Handling ingress payload, got {data}", JsonConvert.SerializeObject(data));
            config.EnvironmentVariables.Add("ID", data.ConnectionDetails.Id);
            config.EnvironmentVariables.Add("DOTNET_ENVIRONMENT", "Production");
            config.EnvironmentVariables.Add("INGRESS_CONFIG__PROTOCOL", data.ConnectionDetails.Protocol);
            config.EnvironmentVariables.Add("INGRESS_CONFIG__PARAMETERS__TRANSMISSION_PAIRS",
                data.ConnectionDetails.Parameters["TRANSMISSION_PAIRS"].GetString());
            config.EnvironmentVariables.Add("INGRESS_CONFIG__PARAMETERS__DATA_FORMAT", data.ConnectionDetails.Parameters["DATA_FORMAT"].GetString());
            if (data.ConnectionDetails.Parameters["DATA_FORMAT"].GetString() == "WITH_METADATA")
            {
                var metadata = data.ConnectionDetails.Parameters["METADATA"];
                foreach (JsonProperty property in metadata.EnumerateObject())
                {
                    if (property.Name != "TIMESTAMP")
                    {
                        config.EnvironmentVariables.Add($"INGRESS_CONFIG__PARAMETERS__METADATA__{property.Name.ToUpper()}", property.Value.ToString());

                    }
                }
            }

            Log.Debug("Now with env variables: {vars}", JsonConvert.SerializeObject(config.EnvironmentVariables));
            switch (data.ConnectionDetails.Protocol)
            {
                case "MQTT":
                    config.EnvironmentVariables.Add("INGRESS_CONFIG__PARAMETERS__HOST", data.ConnectionDetails.Parameters["HOST"].GetString());
                    config.EnvironmentVariables.Add("INGRESS_CONFIG__PARAMETERS__PORT", data.ConnectionDetails.Parameters["PORT"].GetString());
                    config.EnvironmentVariables.Add("INGRESS_CONFIG__PARAMETERS__FREQUENCY", data.ConnectionDetails.Parameters["FREQUENCY"].GetString());
                    config.EnvironmentVariables.Add("INGRESS_CONFIG__PARAMETERS__CHANGED_FREQUENCY", data.ConnectionDetails.Parameters["CHANGED_FREQUENCY"].GetString());
                    break;
                case "RTDE":
                    config.EnvironmentVariables.Add("INGRESS_CONFIG__PARAMETERS__HOST", data.ConnectionDetails.Parameters["HOST"].GetString());
                    config.EnvironmentVariables.Add("INGRESS_CONFIG__PARAMETERS__PORT", data.ConnectionDetails.Parameters["PORT"].GetString());
                    config.EnvironmentVariables.Add("INGRESS_CONFIG__PARAMETERS__FREQUENCY", data.ConnectionDetails.Parameters["FREQUENCY"].GetString());
                    config.EnvironmentVariables.Add("INGRESS_CONFIG__PARAMETERS__CHANGED_FREQUENCY", data.ConnectionDetails.Parameters["CHANGED_FREQUENCY"].GetString());
                    break;
                case "OPCUA":
                    config.EnvironmentVariables.Add("INGRESS_CONFIG__PARAMETERS__SERVER_URL",
                        data.ConnectionDetails.Parameters["SERVER_URL"].GetString());
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
        public void Delete(string id)
        {
            _containerManager.StopContainer(id);
        }
    }
}