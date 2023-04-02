namespace ServiceOrchestrator.ContainerManagement;

public interface IContainerManager
{
    public Task StartContainer(string id, ContainerConfig config);
    public Task StopContainer(string id);

    public void StartContainerBroker(ContainerConfig config, string protocol);

    public void StopContainerBroker(string id);
}