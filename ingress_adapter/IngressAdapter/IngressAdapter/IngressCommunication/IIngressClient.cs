using IngressAdapter.DataModel;

namespace IngressAdapter.IngressCommunication;

public interface IIngressClient
{
    public Task<bool> Initialize(Action<string> messageHandler);
    public void StartIngestion(TransmissionDetails transmissionDetails);
    public bool IsConnected();
    public string GetStatusMessage();
}