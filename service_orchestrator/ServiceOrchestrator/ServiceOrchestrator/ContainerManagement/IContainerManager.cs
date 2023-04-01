namespace ServiceOrchestrator.ContainerManagement;

public interface IContainerManager
{
    public void StartContainer(ContainerConfig config);
    public void StopContainer(string id);

    public void StartContainerBroker(ContainerConfig config, string protocol);

    public void StopContainerBroker(string id);
}