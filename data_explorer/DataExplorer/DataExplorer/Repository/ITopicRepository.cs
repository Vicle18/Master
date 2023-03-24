namespace DataExplorer.Repository;

public interface ITopicRepository
{
    public Task<string> GetTopic(string observablePropertyId);
}