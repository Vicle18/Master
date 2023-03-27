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
    public class ContainingElementController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogger<ContainingElementController> _logger;
        private readonly IContainingElementRepository _containingElementRepo;
        private readonly HttpClient _client;
        public ContainingElementController(IConfiguration config, ILogger<ContainingElementController> logger,
            IContainingElementRepository containingElementRepo)
        {
            _config = config;
            _logger = logger;
            _containingElementRepo = containingElementRepo;
            _logger.LogDebug("starting {controller}", "IngressController");
            _client = new HttpClient();
        }
        // GET: api/ContainingElement
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/ContainingElement/5
        [HttpGet("{id}", Name = "GetContainingElement")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/ContainingElement
        [HttpPost]
        public async Task<ActionResult<string>> Post([FromBody] CreateContainingElementDTO value)
        {
            _logger.LogDebug("creating ingress with values: {value}", value);
            try
            {
                
                var response = await _containingElementRepo.CreateContainingElement(value);
                //return Ok(response);
                return Ok(response);
            }
            catch (ArgumentException e)
            {
                return BadRequest(e.Message);
            }
        }

        // PUT: api/ContainingElement/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ContainingElement/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
