using MiddlewareManager.DataModel;

namespace MiddlewareManager.Repositories;

public interface IContainingElementRepository
{
    public Task<string> CreateContainingElement(CreateContainingElementDTO value);
}