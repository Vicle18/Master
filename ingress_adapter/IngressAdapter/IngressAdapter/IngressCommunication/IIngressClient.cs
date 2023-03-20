namespace IngressAdapter.IngressCommunication;

public interface IIngressClient
{
    public Task<bool> Initialize(Action<string, string> messageHandler);
    public void StartIngestion();
}