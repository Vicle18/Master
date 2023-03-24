using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataExplorer.BusCommunication;
using DataExplorer.Repository;
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
        private readonly ITopicRepository _topicRepo;

        public DataRequestController(IBusClient busClient, ILogger<DataRequestController> logger, ITopicRepository topicRepo)
        {
            _busClient = busClient;
            _logger = logger;
            _topicRepo = topicRepo;
        }
        // GET: api/DataRequest
        [HttpGet("amount/{topic}/{amount}", Name = "getAmount")]
        [Produces("application/json")]
        public async Task<IActionResult> GetAmount(string topic, int amount)
        {
            try
            {
                var extractedTopic = await _topicRepo.GetTopic(topic);
                var messages = _busClient.GetLastMessagesAmount(extractedTopic, amount);
                _logger.LogDebug("got: {message}", string.Join(", ",messages.Select(m => m.Value).ToList()));

            
                var jsonResult = new JArray();
                foreach (var message in messages)
                {
                
                    jsonResult.Add(new JObject()
                    {
                        ["timestamp"] = message.Timestamp.UtcDateTime,
                        ["value"] = message.Value
                    });
                }
                _logger.LogDebug("returning: {message}", jsonResult.ToString());
                return Ok(jsonResult);
            
                // return new string[] { "value1", "value2" };
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return NotFound($"Topic {topic} not found");
            }

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
                    ["value"] = message.Value
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
