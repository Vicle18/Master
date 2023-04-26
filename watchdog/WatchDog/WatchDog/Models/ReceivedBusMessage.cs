using Confluent.Kafka;
using Newtonsoft.Json.Linq;

namespace WatchDog.Models;

public class ReceivedBusMessage
{
    public string Topic { get; set; }
    public Message Message { get; set; }
    public DateTime TimeStamp { get; set; }
    public string Raw { get; set; }
}

public class Message
{
    public string id { get; set; }
    public string status { get; set; }
    public DateTime? timestamp { get; set; }
}