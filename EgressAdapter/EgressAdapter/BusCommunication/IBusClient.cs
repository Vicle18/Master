namespace EgressAdapter.BusCommunication;

public interface IController
{
    public void Subscribe(string topic);
    public void Publish(string topic, string message);
}