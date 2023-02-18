using Confluent.Kafka;
using Newtonsoft.Json.Linq;

namespace DataExplorer.BusCommunication;

public interface IBusClient
{
    public void Initialize();
    public void Publish(string topic, string message);

    public List<Message<Ignore, string>> GetLastMessagesAmount(string topic, int amount);

    public List<Message<Ignore, string>> GetLastMessagesTimeSpan(string topic, int seconds);
}