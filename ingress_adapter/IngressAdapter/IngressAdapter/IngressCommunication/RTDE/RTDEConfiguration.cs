namespace IngressAdapter.IngressCommunication.RTDE;

public class RTDEConfiguration
{
    public string HOST { get; set; }
    public string PORT { get; set; }
    public string TRANSMISSION_PAIRS { get; set; }
    public string FREQUENCY { get; set; }
    public string CHANGED_FREQUENCY { get; set; }

    public override string ToString()
    {
        return $"Host: {HOST}, Port: {PORT}, TransmissionPairs: {TRANSMISSION_PAIRS}";
    }
}