using k8s.Models;
using ServiceOrchestrator.ContainerManagement;

namespace ServiceOrchestrator.Brokers;

public class OPCUABroker : IMessageBroker
{
    public V1Service createService(ContainerConfig config, string uniqueId)
    {
        throw new NotImplementedException();
    }

    public V1Pod createPod(ContainerConfig config, string uniqueId)
    {
        throw new NotImplementedException();
    }
}