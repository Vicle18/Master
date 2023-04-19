using MiddlewareManager.DataModel;

namespace MiddlewareManager.Repositories;

public interface IIngressRepository
{
    public Task<Response> CreateObservableProperty(string id, CreateIngressDtoBase value, string topicName, string connectionDetails);
    public Task<string> DeleteObservableProperty(string id);
    public Task<string> UpdateObservableProperty(UpdateIngressDto value);
}