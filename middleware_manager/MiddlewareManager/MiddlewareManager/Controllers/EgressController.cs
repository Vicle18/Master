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

            Log.Debug(JsonSerializer.Serialize(value));
            try
            {
                Response response = null;
                var id = Guid.NewGuid().ToString();

                ObservableProperty observableProperty = await _egressRepo.GetIngressProperty(value.ingressId);
                var connectionDetails = ConnectionDetailsFactory.Create(id, value, observableProperty);
                _logger.LogDebug("creating new egress with connection details: {details}", JsonSerializer.Serialize(connectionDetails));
                await HTTPForwarder.ForwardsEgressRequestToConfigurator(value, JsonSerializer.Serialize(connectionDetails), _client);

                response = await _egressRepo.CreateEgressEndpoint(id, value,
                JsonSerializer.Serialize(connectionDetails));
                
                return Ok(response);
            }
            catch (ArgumentException e)
            {
                _logger.LogError(e, "got error: {message}", e.Message);
                return BadRequest(e.Message);
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
            _logger.LogDebug("deleting Egress with id: {id}", id);
            try
            {
                var databaseResponse = await _egressRepo.DeleteEgressEndpoint(id);
                var baseAddress = "https://localhost:7033";
                var request = new HttpRequestMessage(HttpMethod.Delete, $"{baseAddress}/api/Egress/{id}");
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