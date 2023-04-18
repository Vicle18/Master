using EgressAdapter.EgressCommunication;

namespace EgressAdapter.Datamodel;

public class TransmissionDetails
{
    public string ORIGIN_TOPIC { get; set; }
    public string TARGET { get; set; }
    public string FREQUENCY { get; set; }
    public string CHANGED_FREQUENCY { get; set; }
    public string DATA_FORMAT { get; set; }
    public string DOWN_SAMPLING_METHOD { get; set; }
    public Metadata METADATA { get; set; }


}