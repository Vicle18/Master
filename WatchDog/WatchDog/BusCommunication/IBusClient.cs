using WatchDog.Models;

namespace WatchDog.BusCommunication;

public interface IBusClient
{
    public void Initialize();
    public void Subscribe(string topic, Action<string, ReceivedBusMessage> messageHandler);
    public void Publish(string topic, string message);
}