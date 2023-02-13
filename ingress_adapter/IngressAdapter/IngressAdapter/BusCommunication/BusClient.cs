using Microsoft.Extensions.Configuration;

namespace IngressAdapter.BusCommunication;

public class BusClient : IBusClient
{
    private readonly IConfiguration _config;

    public BusClient(IConfiguration config)
    {
        _config = config;
    }

    public void Subscribe(string topic)
    {
    }

    public void Publish(string topic, string message)
    {
        
    }
}