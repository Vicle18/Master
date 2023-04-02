using Microsoft.AspNetCore.Mvc;
using Serilog;
using WatchDog.ContainerManagement;

namespace WatchDog.Controllers;

[Route("api/Controller")]
[ApiController]
public class Controller
{
    private readonly ILogger<Controller> _logger;
    private readonly IContainerManager _containerManager;

    public Controller(ILogger<Controller> logger, IContainerManager containerManager)
    {
        _logger = logger;
        _containerManager = containerManager;
        Log.Debug("Inside controller");
       // _containerManager.Initialize();
    }

    // GET: api/Controller
    [HttpGet]
    public IEnumerable<string> Get()
    {
        return new string[] { "value1Egress", "value2Egress" };
    }

    // GET: api/Controller/5
    [HttpGet("{id}", Name = "GetEgress")]
    public string Get(int id)
    {
        return "value";
    }

    // POST: api/Controller
    [HttpPost]
    public void Post([FromBody] string data)
    {
        Log.Debug("value");
    }
}