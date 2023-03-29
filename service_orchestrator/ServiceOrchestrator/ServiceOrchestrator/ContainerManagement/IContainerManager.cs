namespace ServiceOrchestrator.ContainerManagement;

public interface IContainerManager
{
    public Task StartContainer(string id, ContainerConfig config);
    public Task StopContainer(string id);
}