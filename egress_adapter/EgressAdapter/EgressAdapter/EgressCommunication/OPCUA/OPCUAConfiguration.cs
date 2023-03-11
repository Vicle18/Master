namespace EgressAdapter.EgressCommunication.OPCUA;

public class OPCUAConfiguration
{
    public string SERVER_URL { get; set; }
    public List<OPCUATransmissionPair> TRANSMISSION_PAIRS { get; set; }

    public override string ToString()
    {
        return $"SERVER_URL: {SERVER_URL}, TRANSMISSION_PAIRS: {string.Join(", ", TRANSMISSION_PAIRS)}";
    }
}