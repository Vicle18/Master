namespace ServiceOrchestrator.ContainerManagement;

public interface IContainerManager
{
    public void StartContainer(ContainerConfig config);
    public void StopContainer(string id);
}