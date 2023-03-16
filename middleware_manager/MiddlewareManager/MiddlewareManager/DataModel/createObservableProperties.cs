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

public class ObservableProperty
{
    public string Name { get; set; }
    public PropertyOf PropertyOf { get; set; }
    public Topic topic { get; set; }
}

public class PropertyOf
{
    public string Name { get; set; }
}

public class Topic
{
    public string name { get; set; }
    public override string ToString()
    {
        return JsonSerializer.Serialize(this);
    }
}
