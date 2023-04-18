using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
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
        public async Task Post([FromBody] EndpointPayload data)
        {
            ContainerConfig config = new ContainerConfig("clemme/egress:latest", new Dictionary<string, string>());
            AddingConfigurationData(data, config);

            if (data.CreateBroker)
            {
                var host = await _containerManager.StartContainerBroker(data.ConnectionDetails.Id, config, data.ConnectionDetails.Protocol);
                config.EnvironmentVariables["EGRESS_CONFIG__PARAMETERS__HOST"] = host;
                config.EnvironmentVariables["EGRESS_CONFIG__PARAMETERS__PORT"] = "1883";
            }
            await _containerManager.StartContainer(data.ConnectionDetails.Id, config);
        }

        private static void AddingConfigurationData(EndpointPayload data, ContainerConfig config)
        {
            config.EnvironmentVariables.Add("ID", data.ConnectionDetails.Id);
            config.EnvironmentVariables.Add("EGRESS_CONFIG__PROTOCOL", data.ConnectionDetails.Protocol);
            config.EnvironmentVariables.Add("EGRESS_CONFIG__TRANSMISSION_DETAILS__DATA_FORMAT", data.ConnectionDetails.TransmissionDetails["DATA_FORMAT"].GetString());
            config.EnvironmentVariables.Add("DOTNET_ENVIRONMENT", "Production");

            config.EnvironmentVariables.Add("EGRESS_CONFIG__TRANSMISSION_DETAILS__FREQUENCY", data.ConnectionDetails.TransmissionDetails["FREQUENCY"].GetString());
            config.EnvironmentVariables.Add("EGRESS_CONFIG__TRANSMISSION_DETAILS__CHANGED_FREQUENCY", data.ConnectionDetails.TransmissionDetails["CHANGED_FREQUENCY"].GetString());
            config.EnvironmentVariables.Add("EGRESS_CONFIG__TRANSMISSION_DETAILS__ORIGIN_TOPIC", data.ConnectionDetails.TransmissionDetails["ORIGIN_TOPIC"].GetString());
            config.EnvironmentVariables.Add("EGRESS_CONFIG__TRANSMISSION_DETAILS__TARGET", data.ConnectionDetails.TransmissionDetails["TARGET"].GetString());
            config.EnvironmentVariables.Add("EGRESS_CONFIG__TRANSMISSION_DETAILS__DOWN_SAMPLING_METHOD", data.ConnectionDetails.TransmissionDetails["DOWN_SAMPLING_METHOD"].GetString());
            if (data.ConnectionDetails.TransmissionDetails["DATA_FORMAT"].GetString() == "WITH_METADATA")
            {
                var metadata = data.ConnectionDetails.TransmissionDetails["METADATA"];
                foreach (JsonProperty property in metadata.EnumerateObject())
                {
                    if (property.Name != "TIMESTAMP")
                    {
                        config.EnvironmentVariables.Add($"EGRESS_CONFIG__TRANSMISSION_DETAILS__METADATA__{property.Name.ToUpper()}", property.Value.ToString());

                    }
                }
            }
            if (data.ConnectionDetails.Protocol == Protocol.MQTT.ToString())
            {
                config.EnvironmentVariables.Add("EGRESS_CONFIG__PARAMETERS__HOST", data.ConnectionDetails.Parameters["HOST"].GetString());
                config.EnvironmentVariables.Add("EGRESS_CONFIG__PARAMETERS__PORT", data.ConnectionDetails.Parameters["PORT"].GetString());
            }
            else if (data.ConnectionDetails.Protocol == Protocol.OPCUA.ToString())
            {
                config.EnvironmentVariables.Add("EGRESS_CONFIG__PARAMETERS__SERVER_URL",
                    data.ConnectionDetails.Parameters["SERVER_URL"].GetString());
            }
            else if (data.ConnectionDetails.Protocol == Protocol.REST.ToString())
            {
                Log.Error("REST IS NOT SUPPORTED YET");
            }
            Log.Debug("config: {config}, data: {data}",JsonConvert.SerializeObject(config), JsonConvert.SerializeObject(data));
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