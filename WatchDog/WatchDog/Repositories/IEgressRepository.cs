namespace WatchDog.Repositories;

public interface IEgressRepository
{
    public Task<List<string>> getEgressEndpoints();

    public Task<bool> updateEgressStatus(string id, bool active);
}