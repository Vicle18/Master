using MiddlewareManager.DataModel;
using MiddlewareManager.Protocols;

namespace MiddlewareManager.Repositories;

public interface IIngressRepository
{
    public Task<Response> CreateObservableProperty(string id, IngressDTOBase value, string topicName, string connectionDetails);
    public Task<string> DeleteObservableProperty(string id);
    public Task<string> UpdateObservableProperty(UpdateIngressDto value, string connectionDetails);
}