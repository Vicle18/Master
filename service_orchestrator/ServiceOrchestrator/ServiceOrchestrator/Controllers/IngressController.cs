using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Serilog;
using ServiceOrchestrator.ContainerManagement;
using ServiceOrchestrator.ContainerManagement.Kubernetes;

namespace ServiceOrchestrator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IngressController : ControllerBase
    {
        private readonly ILogger<IngressController> _logger;
        private readonly IContainerManager _containerManager;

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
        public void Post([FromBody] object data)
        {
            Log.Debug("Inside post");
            
            Log.Debug(data?.ToString());
            Log.Debug("INITIALDATA", data.ToString());

            ContainerConfig config = new ContainerConfig();
            
            
            ////dynamic jsonObject = JsonConvert.DeserializeObject<dynamic>(json); // deserialize JSON string into dynamic object
            //Log.Debug(jsonObject);
            
            //config.EnvironmentVariables.Add();
        }


        // PUT: api/Ingress/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/Ingress/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}