using IngressAdapter.IngressCommunication.MQTT;
using IngressAdapter.IngressCommunication.OPCUA;
using IngressAdapter.IngressCommunication.RTDE;
using Microsoft.Extensions.Configuration;

namespace IngressAdapter.IngressCommunication;

public class IngressClientCreator : IIngressClientCreator
{
    private readonly IConfiguration _config;

    public IngressClientCreator(IConfiguration config)
    {
        _config = config;
    }
    
    public IIngressClient CreateIngressClient(string clientType)
    {
        switch (clientType.ToUpper())
        {
            case "OPCUA":
                return new OPCUAIngressClient(_config);
            case "MQTT":
                return new MQTTIngressClient(_config);
            case "RTDE":
                return new RTDEIngressClient(_config);
            default:
                throw new ArgumentException($"Could not find client type: {clientType}");
        }
    }
}