namespace IngressAdapter.IngressCommunication.MQTT;

public class MQTTConfiguration
{
    public string HOST { get; set; }
    public string PORT { get; set; }
    public string TRANSMISSION_PAIRS { get; set; }
    
    public string TARGET_TOPIC { get; set; }
    public string FREQUENCY { get; set; }
    public string CHANGED_FREQUENCY { get; set; }

    public override string ToString()
    {
        return $"Host: {HOST}, Port: {PORT}, TransmissionPairs: {TRANSMISSION_PAIRS}";
    }
}