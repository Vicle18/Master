namespace ServiceOrchestrator.ContainerManagement;

public class ContainerConfig
{
    private string _ImageName;
    private Dictionary<string, string> _EnvironmentVariables;

    public ContainerConfig(string imageName, Dictionary<string, string> environmentVariables)
    {
        _ImageName = imageName;
        _EnvironmentVariables = environmentVariables;
        Initialize();
    }

    private void Initialize()
    {
        _EnvironmentVariables.Add("BUS_CONFIG__PROTOCOL", "KAFKA");
        _EnvironmentVariables.Add("BUS_CONFIG__PARAMETERS__HOST", "my-cluster-kafka-brokers");
        _EnvironmentVariables.Add("BUS_CONFIG__PARAMETERS__PORT", "9092");
    }

    public string ImageName
    {
        get { return _ImageName; }
        set { _ImageName = value; }
    }

    public Dictionary<string, string> EnvironmentVariables
    {
        get { return _EnvironmentVariables; }
        set { _EnvironmentVariables = value; }
    }

    public override string ToString()
    {
        return
            $"container with image: {_ImageName} and variables: {string.Join(Environment.NewLine, EnvironmentVariables)}";
    }
}