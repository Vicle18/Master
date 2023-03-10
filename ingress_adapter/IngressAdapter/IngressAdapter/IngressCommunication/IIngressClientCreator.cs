namespace IngressAdapter.IngressCommunication;

public interface IIngressClientCreator
{
    public IIngressClient CreateIngressClient(string clientType);
}