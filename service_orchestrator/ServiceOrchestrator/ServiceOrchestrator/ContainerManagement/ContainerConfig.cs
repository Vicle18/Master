namespace ServiceOrchestrator.ContainerManagement;

public struct ContainerConfig
{
    public string ImageName { get; set; }
    public Dictionary<string,string> EnvironmentVariables { get; set; }
}