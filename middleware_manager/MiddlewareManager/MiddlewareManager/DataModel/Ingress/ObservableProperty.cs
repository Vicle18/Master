using System.Text.Json;

namespace MiddlewareManager.DataModel;

public partial class ObservableProperty
{
    public string? id { get; set; }
    public string? name { get; set; }
    public int frequency { get; set; }
    public int? changedFrequency { get; set; }
    public Topic topic { get; set; }

    public string? dataFormat { get; set; }
}

public class Topic
{
    public string name { get; set; }

    public string id { get; set; }

    public override string ToString()
    {
        return JsonSerializer.Serialize(this);
    }
}