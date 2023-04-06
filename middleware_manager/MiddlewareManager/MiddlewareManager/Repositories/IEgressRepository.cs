using MiddlewareManager.DataModel;

namespace MiddlewareManager.Repositories;

public interface IEgressRepository
{
    public Task<Response> CreateEgressEndpoint(string id, CreateEgressDto value,
        List<string> connectionDetails, List<ObservableProperty> observableProperties, string egressGroupId);

    public Task<List<ObservableProperty>> getIngressProperties(string[] valueIngressNodes);

    public Task<string> DeleteEgressEndpoint(string id);
}