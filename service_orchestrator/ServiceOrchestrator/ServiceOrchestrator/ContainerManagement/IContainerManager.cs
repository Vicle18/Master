namespace ServiceOrchestrator.ContainerManagement;

public interface IContainerManager
{
<<<<<<< HEAD
    public Task StartContainer(string id, ContainerConfig config);
    public Task StopContainer(string id);
=======
    public void StartContainer(ContainerConfig config);
    public void StopContainer(string id);

    public void StartContainerBroker(ContainerConfig config, string protocol);

    public void StopContainerBroker(string id);
>>>>>>> 32065431a922722ff55376aa22c19fb0d2189447
}