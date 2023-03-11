using EgressAdapter.EgressCommunication.MQTT;
using EgressAdapter.EgressCommunication.OPCUA;
using Microsoft.Extensions.Configuration;

namespace EgressAdapter.EgressCommunication;

public class EgressClientCreator : IEgressClientCreator
{
    private readonly IConfiguration _config;

    public EgressClientCreator(IConfiguration config)
    {
        _config = config;
    }
    
    public IEgressClient CreateEgressClient(string clientType)
    {
        switch (clientType.ToUpper())
        {
            case "OPCUA":
                return new OPCUAEgressClient(_config);
            case "MQTT":
                return new MQTTEgressClient(_config);
            default:
                throw new ArgumentException($"Could not find client type: {clientType}");
        }
    }
}