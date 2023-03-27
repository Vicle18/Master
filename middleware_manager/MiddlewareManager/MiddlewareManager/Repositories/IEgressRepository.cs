using MiddlewareManager.DataModel;

namespace MiddlewareManager.Repositories;

public interface IEgressRepository
{
    public Task<Response> CreateEgressEndpoint(CreateEgressDto value,
        string connectionDetails, ObservableProperty observableProperty, string egressGroupId);

    public Task<List<ObservableProperty>> getIngressProperties(string[] valueIngressNodes);
}