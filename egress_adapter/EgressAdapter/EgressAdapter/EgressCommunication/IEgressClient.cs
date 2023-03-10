namespace EgressAdapter.EgressCommunication;

public interface IEgressClient
{
    public void Initialize(Action<string, string> messageHandler);
    public void PublishDatapoint()
   // public void StartPublishing();
}