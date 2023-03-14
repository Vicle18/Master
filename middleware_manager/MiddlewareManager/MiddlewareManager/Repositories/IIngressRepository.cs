using MiddlewareManager.DataModel;

namespace MiddlewareManager.Repositories;

public interface IIngressRepository
{
    public Task<Response> CreateObservableProperty(CreateIngressDTO value, string topicName);
}