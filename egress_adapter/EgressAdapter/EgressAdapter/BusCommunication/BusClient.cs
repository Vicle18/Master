using Microsoft.Extensions.Configuration;
using Confluent.Kafka;
using Newtonsoft.Json;
using Serilog;

namespace EgressAdapter.BusCommunication;

public class BusClient : IBusClient
{
    private readonly IConfiguration _config;
    public BusClient(IConfiguration config)
    {
        _config = config;
    }

    public void Initialize()
    {
        throw new NotImplementedException();
    }

    public void Subscribe(string topic, Action<string, string> messageHandler)
    {
        throw new NotImplementedException();
    }

    public void Publish(string topic, string message)
    {
        throw new NotImplementedException();
    }

    
}