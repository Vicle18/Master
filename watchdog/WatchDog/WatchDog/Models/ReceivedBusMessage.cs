using Newtonsoft.Json.Linq;

namespace WatchDog.Models;

public class ReceivedBusMessage
{
    public string Topic { get; set; }
    public string Message { get; set; }
    public DateTime TimeStamp { get; set; }
    public string Raw { get; set; }
}