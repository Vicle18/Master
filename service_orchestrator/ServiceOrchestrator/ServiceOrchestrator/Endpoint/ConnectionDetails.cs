using System.Text.Json;
using System.Text.Json.Nodes;
using Newtonsoft.Json.Linq;

namespace ServiceOrchestrator.Endpoint;

public class ConnectionDetails
{
    public string Id { get; set; }
    public string Protocol { get; set; }
    public Dictionary<string, JsonElement> Parameters { get; set; }
    public Dictionary<string, JsonElement>? Transmission_Details { get; set; }

}