using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MiddlewareManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContainingElementController : ControllerBase
    {
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
        public void Post([FromBody] string value)
        {
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
