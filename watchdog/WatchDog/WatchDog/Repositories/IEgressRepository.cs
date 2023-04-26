namespace WatchDog.Repositories;

public interface IEgressRepository
{
    public Task<List<string>> getEgressEndpoints();

    Task<bool> updateEgressStatus(string id, string status, DateTime lastUpdatedAt, DateTime? lastMessageReceived);
}