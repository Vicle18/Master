using GraphQL;

namespace MiddlewareManager.DataModel;

public class ObservablePropertyResponse
{
    public List<ObservableProperty> ObservableProperties { get; set; }
    public List<GraphQLError> Errors { get; set; }
    public object Extensions { get; set; }
}