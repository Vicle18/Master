using MiddlewareManager.DataModel;

namespace MiddlewareManager.Protocols;

public interface IConnectionDetailsFactory
{
    public IConnectionDetails CreateIngress(string id, IngressDTOBase value, string topicName);
    public IConnectionDetails CreateEgress(string id, CreateEgressDto value, ObservableProperty property);
}