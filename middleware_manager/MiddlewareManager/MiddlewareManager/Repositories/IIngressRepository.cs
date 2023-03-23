using MiddlewareManager.DataModel;

namespace MiddlewareManager.Repositories;

public interface IIngressRepository
{
    public Task<Response> CreateObservableProperty(CreateIngressDto value, string topicName, string connectionDetails);
}