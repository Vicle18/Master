namespace IngressAdapter.IngressCommunication.MQTT;

public class MQTTConfiguration
{
    public string HOST { get; set; }
    public string PORT { get; set; }
    public string TOPIC { get; set; }


    public override string ToString()
    {
        return $"Host: {HOST}, Port: {PORT}";
    }
}