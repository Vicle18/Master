using MiddlewareManager.DataModel;

namespace MiddlewareManager.Repositories;

public interface IEgressRepository
{
    public Task<Response> CreateEgressEndpoint(string id, CreateEgressDto value,
        string connectionDetails, ObservableProperty observableProperty, string egressGroupId);

    public Task<List<ObservableProperty>> getIngressProperties(string[] valueIngressNodes);

    public Task<ObservableProperty> GetIngressProperty(string ingressId);//implement

    public Task<string> DeleteEgressEndpoint(string id);
}