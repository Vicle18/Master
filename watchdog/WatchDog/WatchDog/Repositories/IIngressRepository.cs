namespace WatchDog.Repositories;

public interface IIngressRepository
{
    public Task<Dictionary<string, string>> getObservableProperties();

    public Task<bool> updateObservableStatus(string id, string status, DateTime lastUpdatedAt);
}