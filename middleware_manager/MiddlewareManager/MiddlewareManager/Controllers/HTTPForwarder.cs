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
        string connectionDetails, HttpClient client)
    {
        // Create the HTTP request message with the JSON string as the content
        var request = new HttpRequestMessage(HttpMethod.Post, "https://localhost:7033/api/Ingress?=");
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
    public static async Task ForwardsEgressRequestToConfigurator(CreateEgressDto value,
        string connectionDetails, HttpClient client)
    {
        try
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "https://localhost:7033/api/Egress?=");
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