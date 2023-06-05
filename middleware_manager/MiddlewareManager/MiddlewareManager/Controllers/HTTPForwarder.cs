using System.Text;
using MiddlewareManager.DataModel;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Serilog;

namespace MiddlewareManager.Controllers;

public class HTTPForwarder
{

    /**
    * Creates an HTTP request to the ServiceConfigurator
    */
    public static async Task ForwardsIngressRequestToConfigurator(
        IConfiguration _config, string connectionDetails, HttpClient client)
    {
        var _baseAddress = _config.GetValue<string>("SERVICE_ORCHESTRATOR_URL");
        // CreateEgress the HTTP request message with the JSON string as the content
        var request = new HttpRequestMessage(HttpMethod.Post, $"{_baseAddress}/api/Ingress?=");
        var contentObject = new JObject()
        {
            ["CreateBroker"] = true,
            ["ConnectionDetails"] = JsonConvert.DeserializeObject<JToken>(connectionDetails)
        };
        Console.WriteLine($"connectionDetails: {contentObject}");
        //request.Content = new StringContent(connectionDetails, Encoding.UTF8, "application/json");
        request.Content = new StringContent(contentObject.ToString(), Encoding.UTF8, "application/json");

        var response = await client.SendAsync(request);
        request.Content = new StringContent(connectionDetails, Encoding.UTF8, "application/json");

        // Get the response content
        var responseString = await response.Content.ReadAsStringAsync();
        Log.Debug("Received ServiceConfigurator Response: {responseString}", responseString);
    }

    /**
         * Creates an HTTP request to the ServiceConfigurator
         */
    public static async Task ForwardsEgressRequestToConfigurator(IConfiguration _config, CreateEgressDto value,
        string connectionDetails, HttpClient client)
    {
        try
        {
            var _baseAddress = _config.GetValue<string>("SERVICE_ORCHESTRATOR_URL");
            // CreateEgress the HTTP request message with the JSON string as the content
            var request = new HttpRequestMessage(HttpMethod.Post, $"{_baseAddress}/api/Egress?=");
            var contentObject = new JObject()
            {
                ["CreateBroker"] = value.createBroker,
                ["ConnectionDetails"] = JsonConvert.DeserializeObject<JToken>(connectionDetails),
            };
            Console.WriteLine($"connectionDetails: {contentObject.ToString()}");
            request.Content = new StringContent(contentObject.ToString(), Encoding.UTF8, "application/json");
            var response = await client.SendAsync(request);

            var responseString = await response.Content.ReadAsStringAsync();
            Log.Debug("Received ServiceConfigurator Response: {responseString}", responseString);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw new ArgumentException($"Could not forward request: {e.Message}", e);
        }
    }
}