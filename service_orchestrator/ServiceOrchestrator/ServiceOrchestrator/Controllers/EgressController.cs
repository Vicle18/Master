using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Serilog;

namespace ServiceOrchestrator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EgressController : ControllerBase
    {
        private Dictionary<string, string> envVariables = new Dictionary<string, string>();
        
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
        public void Post([FromBody] object data)
        {
            Log.Debug(data?.ToString());
            Log.Debug("INITIALDATA", data.ToString());
            
            //string json = JsonConvert.SerializeObject(data); // convert object to JSON string

            //dynamic jsonObject = JsonConvert.DeserializeObject<dynamic>(json); // deserialize JSON string into dynamic object
            
            //Log.Debug(jsonObject);

            //KubernetesManager.StartContainer(data);
            
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