using System.Text.Json;

namespace MiddlewareManager.DataModel;

public class Response
{
    public CreateObservablePropertiesResult createObservableProperties { get; set; }
    public override string ToString()
    {
        return JsonSerializer.Serialize(this);
    }
}

public class CreateObservablePropertiesResult
{
    public List<ObservableProperty> ObservableProperties { get; set; }
}
