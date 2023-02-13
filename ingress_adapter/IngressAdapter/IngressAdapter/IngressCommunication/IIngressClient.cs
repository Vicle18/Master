namespace IngressAdapter.IngressCommunication;

public interface IIngressClient
{
    public void Initialize(Action<string, string> messageHandler);
    public void StartIngestion();
}