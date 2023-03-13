using EgressAdapter.BusCommunication;

namespace EgressAdapter.EgressCommunication;

public interface IEgressClient
{
    public void Initialize(IBusClient busClient);
}