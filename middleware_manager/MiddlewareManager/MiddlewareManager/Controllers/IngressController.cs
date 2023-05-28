using Microsoft.AspNetCore.Mvc;
using MiddlewareManager.DataModel;
using MiddlewareManager.Protocols;
using MiddlewareManager.Repositories;
using Serilog;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace MiddlewareManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IngressController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogger<IngressController> _logger;
        private readonly IIngressRepository _ingressRepo;
        private readonly IConnectionDetailsFactory _connectionDetailsFactory;
        private readonly HttpClient _client;
        private readonly string _serviceConfiguratorUrl;
        public IngressController(IConfiguration config, ILogger<IngressController> logger,
            IIngressRepository ingressRepo, IConnectionDetailsFactory connectionDetailsFactory)
        {
            _config = config;
            _logger = logger;
            _ingressRepo = ingressRepo;
            _connectionDetailsFactory = connectionDetailsFactory;
            _logger.LogDebug("starting {controller}", "IngressController");
            _serviceConfiguratorUrl = _config.GetValue<string>("SERVICE_ORCHESTRATOR_URL");
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
                var topicName = $"{value.name.Replace(" ", "")}-{Guid.NewGuid().ToString()}";
                var id = Guid.NewGuid().ToString();
                var connectionDetails =
                    _connectionDetailsFactory.CreateIngress(id, value, topicName);
                var response = await _ingressRepo.CreateObservableProperty(id, value, topicName,
                    JsonSerializer.Serialize(connectionDetails));

                await HTTPForwarder.ForwardsIngressRequestToConfigurator( _config, JsonSerializer.Serialize(connectionDetails), _client);
                
                return Ok(response);
            }
            catch (ArgumentException e)
            {
                _logger.LogError(e,"Error when receiving ingress post request: {message}", e.Message );
                return BadRequest(e.Message);
            }
        }
        
        
        [HttpPost("IngressFromFile")]
        public async Task<ActionResult<CreateObservablePropertiesResult>> PostFromFile([FromBody] IngressFromFileDto file)
        {
            _logger.LogDebug("creating ingress from file with values: {value}", file);
            try
            {
                var topicName = file.topic;
               

                var response = await _ingressRepo.CreateObservableProperty(file.id, file, topicName,
                    file.connectionDetails);

                await HTTPForwarder.ForwardsIngressRequestToConfigurator(_config, file.connectionDetails, _client);

                return Ok(response);
            }
            catch (ArgumentException e)
            {
                return BadRequest(e.Message);
            }
        }
        
        // POST: api/Ingress/update
        [HttpPost("update")]
        public async Task<ActionResult<CreateObservablePropertiesResult>> Update([FromBody] UpdateIngressDto value)
        {
            _logger.LogDebug("updating ingress with values: {value}", value);
            try
            {
                var topicName = $"{value.name.Replace(" ", "")}-{Guid.NewGuid().ToString()}";
                var id = Guid.NewGuid().ToString();
                var connectionDetails =
                    _connectionDetailsFactory.CreateIngress(id, value, topicName);
                Log.Debug("HEYEH");
                Log.Debug(JsonSerializer.Serialize(connectionDetails));
                var response = await _ingressRepo.UpdateObservableProperty(value, JsonSerializer.Serialize(connectionDetails));
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
        public async Task<ActionResult<CreateObservablePropertiesResult>> Delete(string id)
        {
            _logger.LogDebug("deleting ingress with id: {id}", id);
            try
            {
                var database_response = await _ingressRepo.DeleteObservableProperty(id);
                var _baseAddress = _serviceConfiguratorUrl;
                var request = new HttpRequestMessage(HttpMethod.Delete, $"{_baseAddress}/api/Ingress/{id}");
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