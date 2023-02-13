namespace IngressAdapter.BusCommunication;

public interface IBusClient
{
    public void Subscribe(string topic);
    public void Publish(string topic, string message);
}