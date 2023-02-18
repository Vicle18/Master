using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataExplorer.BusCommunication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace DataExplorer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataRequestController : ControllerBase
    {
        private readonly IBusClient _busClient;
        private readonly ILogger<DataRequestController> _logger;

        public DataRequestController(IBusClient busClient, ILogger<DataRequestController> logger)
        {
            _busClient = busClient;
            _logger = logger;
        }
        // GET: api/DataRequest
        [HttpGet("amount/{topic}/{amount}", Name = "getAmount")]
        [Produces("application/json")]
        public JArray GetAmount(string topic, int amount)
        {
            var messages = _busClient.GetLastMessagesAmount(topic, amount);
            _logger.LogDebug("got: {message}", string.Join(", ",messages.Select(m => m.Value).ToList()));

            
            var jsonResult = new JArray();
            foreach (var message in messages)
            {
                
                jsonResult.Add(new JObject()
                {
                    ["timestamp"] = message.Timestamp.UtcDateTime,
                    ["message"] = message.Value
                });
            }
            _logger.LogDebug("returning: {message}", jsonResult.ToString());
            return jsonResult;
            
            // return new string[] { "value1", "value2" };
            
        }
        
        [HttpGet("seconds-ago/{topic}/{seconds}", Name = "getSeconds")]
        public JArray GetFromSeconds(string topic, int seconds)
        {
            
            
            var messages = _busClient.GetLastMessagesTimeSpan(topic, seconds);
            _logger.LogDebug("got: {message}", string.Join(", ",messages.Select(m => m.Value).ToList()));

            
            var jsonResult = new JArray();
            foreach (var message in messages)
            {
                
                jsonResult.Add(new JObject()
                {
                    ["timestamp"] = message.Timestamp.UtcDateTime,
                    ["message"] = message.Value
                });
            }
            _logger.LogDebug("returning: {message}", jsonResult.ToString());
            return jsonResult;
            
        }

        // GET: api/DataRequest/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/DataRequest
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/DataRequest/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/DataRequest/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
