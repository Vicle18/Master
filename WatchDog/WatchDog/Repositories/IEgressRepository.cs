namespace WatchDog.Repositories;

public interface IEgressRepository
{
    public Task<string> getEgressProperties();

    public Task<bool> updateEgressStatus(string id);
}