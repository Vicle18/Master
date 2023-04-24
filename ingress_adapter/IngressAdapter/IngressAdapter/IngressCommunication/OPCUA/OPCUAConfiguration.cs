namespace IngressAdapter.IngressCommunication.OPCUA;

public class OPCUAConfiguration
{
    public string SERVER_URL { get; set; }
    public string NODE_NAME { get; set; }


    public override string ToString()
    {
        return $"SERVER_URL: {SERVER_URL}";
    }
}