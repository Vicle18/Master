namespace EgressAdapter.EgressCommunication.OPCUA;

public class OPCUAConfiguration
{
    public string SERVER_URL { get; set; }
    public override string ToString()
    {
        return $"SERVER_URL: {SERVER_URL}";
    }
}