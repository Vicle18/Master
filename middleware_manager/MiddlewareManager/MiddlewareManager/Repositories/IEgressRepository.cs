using MiddlewareManager.DataModel;

namespace MiddlewareManager.Repositories;

public interface IEgressRepository
{
    public Task<Response> CreateObservableProperty(CreateEgressDto value, string topicName,
        string connectionDetails, ObservableProperty observableProperty);

    public Task<List<ObservableProperty>> getIngressProperties(string[] valueIngressNodes);
}