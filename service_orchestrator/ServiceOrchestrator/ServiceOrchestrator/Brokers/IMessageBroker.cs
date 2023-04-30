using k8s.Models;
using ServiceOrchestrator.ContainerManagement;

namespace ServiceOrchestrator.Brokers;

public interface IMessageBroker
{
    public V1Service createService(ContainerConfig config, string uniqueId);
    public V1Pod createPod(ContainerConfig config, string uniqueId);
}