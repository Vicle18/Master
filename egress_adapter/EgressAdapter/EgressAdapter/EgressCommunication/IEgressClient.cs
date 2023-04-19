using EgressAdapter.BusCommunication;

namespace EgressAdapter.EgressCommunication;

public interface IEgressClient
{
    public void Initialize(IBusClient busClient);
    public Task PublishMessage(string message, string target);
}