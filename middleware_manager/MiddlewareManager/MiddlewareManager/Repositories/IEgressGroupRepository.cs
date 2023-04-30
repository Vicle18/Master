using MiddlewareManager.DataModel;

namespace MiddlewareManager.Repositories;

public interface IEgressGroupRepository
{
    public Task<Response> CreateEgressGroup(string id, CreateEgressGroupDTO value);
}