using MiddlewareManager.DataModel;

namespace MiddlewareManager.Repositories;

public interface IEgressRepository
{
    public Task<CreateEgressResponse> CreateObservableProperty(CreateEgressDTO value, string topicName,
        string connectionDetails);

}