namespace EgressAdapter.EgressCommunication.OPCUA;

public class OPCUATransmissionPair
{
    public string NODE_NAME { get; set; }
    public string VALUE_TYPE { get; set; }
    public string ORIGIN_TOPIC { get; set; }

    public override string ToString()
    {
        return
            $"Transmission pair with nodename: {NODE_NAME}, value type: {VALUE_TYPE} and origin topic: {ORIGIN_TOPIC}";
    }
}