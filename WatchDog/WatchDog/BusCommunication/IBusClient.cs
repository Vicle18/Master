namespace WatchDog.BusCommunication;

public interface IBusClient
{
    public void Initialize();
    public void Subscribe(string topic, Action<string, string> messageHandler);
    public void Publish(string topic, string message);
}