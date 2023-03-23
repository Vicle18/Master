using MiddlewareManager.DataModel;

namespace MiddlewareManager.Repositories;

public interface IEgressRepository
{
    public Task<CreateEgressResponse> CreateObservableProperty(CreateEgressDto value, string topicName,
        string connectionDetails, ObservableProperty observableProperty);

}