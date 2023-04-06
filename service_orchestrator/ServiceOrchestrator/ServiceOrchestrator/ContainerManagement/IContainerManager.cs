namespace ServiceOrchestrator.ContainerManagement;

public interface IContainerManager
{
    public Task StartContainer(string id, ContainerConfig config);
    public Task StopContainer(string id);


    public Task<string> StartContainerBroker(string id, ContainerConfig config, string protocol);

    public void StopContainerBroker(string id);
}