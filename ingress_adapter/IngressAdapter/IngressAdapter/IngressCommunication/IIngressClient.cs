namespace IngressAdapter.IngressCommunication;

public interface IIngressClient
{
    public void Initialize();
    public void StartIngestion();
}