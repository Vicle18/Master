namespace EgressAdapter.BusCommunication;

public interface IBusClient
{
    public void Initialize();
    /// <summary>
    /// Responsible for initiating the consumation of messages from kafka topics, starting the primary loop
    /// </summary>
    public Task Run();
    
    /// <summary>
    /// Responsible for adding a new subscription to be listened to
    /// </summary>
    /// <param name="topic"></param>
    public void AddSubscription(string topic, Action<string, string> msgHandler);
    
    /// <summary>
    /// Responsible for removing a previously subscribed to topic
    /// </summary>
    /// <param name="topic"></param>
    public void RemoveSubscription(string topic);
    
    /// <summary>
    /// Responsible for sending messages to one or more specified topics
    /// </summary>
    public void PublishMessage(string topic, string message);
}