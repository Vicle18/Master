using Serilog;
using ServiceOrchestrator.Endpoint;
using ServiceOrchestrator.Protocols.EgressProtocolEnvironmentVariablesCreators;
using ServiceOrchestrator.Protocols.IngressProtocolEnvironmentVariablesCreators;

namespace ServiceOrchestrator.Protocols;

public class EnvVarCreator : IEnvVarCreator
{
    private readonly IConfiguration _config;
    private MqttIngressEnvVarFactory _ingressMQTTFactory;
    private RtdeIngressEnvVarFactory _ingressRTDEFactory;
    private OpcuaIngressEnvVarFactory _ingressOPCUAFactory;
    private MqttEgressEnvVarFactory _egressMQTTFactory;
    private OpcuaEgressEnvVarFactory _egressOPCUAFactory;

    public EnvVarCreator(IConfiguration config)
    {
        _config = config;
        InitIngressFactories();
        InitEgressFactories();
    }

    private void InitIngressFactories()
    {
        _ingressMQTTFactory = new MqttIngressEnvVarFactory(_config);
        _ingressRTDEFactory = new RtdeIngressEnvVarFactory(_config);
        _ingressOPCUAFactory = new OpcuaIngressEnvVarFactory(_config);
    }
    
    private void InitEgressFactories()
    {
        _egressMQTTFactory = new MqttEgressEnvVarFactory(_config);
        _egressOPCUAFactory = new OpcuaEgressEnvVarFactory(_config);
    }
    
    public Dictionary<string, string> CreateIngressEnvVars(EndpointPayload data)
    {
        switch (data.ConnectionDetails.Protocol)
        {
            case "MQTT":
                return _ingressMQTTFactory.CreateEnvironmentVariables(data);
            case "RTDE":
                return _ingressRTDEFactory.CreateEnvironmentVariables(data);
            case "OPCUA":
                return _ingressOPCUAFactory.CreateEnvironmentVariables(data);
            case "REST":
                Log.Error("REST IS NOT SUPPORTED YET");
                throw new ArgumentException("Unsupported protocol");
            default:
                throw new ArgumentException("Unsupported protocol");
        }    
    }

    public Dictionary<string, string> CreateEgressEnvVars(EndpointPayload data)
    {
        switch (data.ConnectionDetails.Protocol)
        {
            case "MQTT":
                return _egressMQTTFactory.CreateEnvironmentVariables(data);
            case "OPCUA":
                return _egressOPCUAFactory.CreateEnvironmentVariables(data);
            default:
                throw new ArgumentException("Unsupported protocol");
        }       }
}