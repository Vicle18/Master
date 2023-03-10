namespace IngressAdapter.IngressCommunication.OPCUA;

public class OPCUAConfiguration
{
    public string SERVER_URL { get; set; }
    public string NODE_NAME { get; set; }
    public string VALUE_TYPE { get; set; }
    public string TARGET_TOPIC { get; set; }
    
    public override string ToString()
    {
        return $"SERVER_URL: {SERVER_URL}, NODE_NAME: {NODE_NAME}, VALUE_TYPE: {VALUE_TYPE}";
    }
}