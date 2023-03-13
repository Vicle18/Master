namespace EgressAdapter.EgressCommunication;

public interface IEgressClientCreator
{
    public IEgressClient CreateEgressClient(string clientType);
}