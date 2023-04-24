namespace WatchDog.Repositories;

public interface IIngressRepository
{
    public Task<List<string>> getObservableProperties();

    public Task<bool> updateObservableStatus(string id, string status, DateTime lastUpdatedAt);
}