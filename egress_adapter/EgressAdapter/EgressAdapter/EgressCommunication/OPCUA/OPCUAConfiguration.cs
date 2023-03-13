namespace EgressAdapter.EgressCommunication.OPCUA;

public class OPCUAConfiguration
{
    public string SERVER_URL { get; set; }
    public string TRANSMISSION_PAIRS { get; set; }

    public override string ToString()
    {
        return $"SERVER_URL: {SERVER_URL}, TRANSMISSION_PAIRS: {TRANSMISSION_PAIRS}";
    }
}