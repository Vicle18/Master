using System.Text.Json;

namespace MiddlewareManager.DataModel;

public class Response
{
    public CreateObservablePropertiesResponse createObservableProperties { get; set; }
    public override string ToString()
    {
        return JsonSerializer.Serialize(this);
    }
}

public class CreateObservablePropertiesResponse
{
    public CreateObservablePropertiesInfo info { get; set; }
    public List<ObservableProperty> observableProperties { get; set; }
    public override string ToString()
    {
        return JsonSerializer.Serialize(this);
    }
}

public class CreateObservablePropertiesInfo
{
    public int nodesCreated { get; set; }
    public int relationshipsCreated { get; set; }
    public override string ToString()
    {
        return JsonSerializer.Serialize(this);
    }
}

public class ObservableProperty
{
    public string name { get; set; }
    public Topic topic { get; set; }
    public override string ToString()
    {
        return JsonSerializer.Serialize(this);
    }
}

public class Topic
{
    public string name { get; set; }
    public override string ToString()
    {
        return JsonSerializer.Serialize(this);
    }
}
