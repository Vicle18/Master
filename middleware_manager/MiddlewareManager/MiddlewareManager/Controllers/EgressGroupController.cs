using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MiddlewareManager.DataModel;
using MiddlewareManager.Repositories;
using Newtonsoft.Json;

namespace MiddlewareManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EgressGroupController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EgressGroupController> _logger;
        private readonly IEgressGroupRepository _egressGroupRepo;
        private readonly HttpClient _client;
        public EgressGroupController(IConfiguration config, ILogger<EgressGroupController> logger,
            IEgressGroupRepository egressGroupRepo)
        {
            _config = config;
            _logger = logger;
            _egressGroupRepo = egressGroupRepo;
            _logger.LogDebug("starting {controller}", "IngressController");
            _client = new HttpClient();
        }
        // GET: api/EgressGroup
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/EgressGroup/5
        [HttpGet("{id}", Name = "GetEgressGroup")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/EgressGroup
        [HttpPost]
        public async Task<ActionResult<string>> Post([FromBody] CreateEgressGroupDTO value)
        {
            _logger.LogDebug("creating Egress group with values: {value}", value);
            try
            {
                var id = Guid.NewGuid().ToString();

                var response = await _egressGroupRepo.CreateEgressGroup(id, value);
                return Ok(response);
            }
            catch (ArgumentException e)
            {
                return BadRequest(e.Message);
            }
        }

        // PUT: api/EgressGroup/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/EgressGroup/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
