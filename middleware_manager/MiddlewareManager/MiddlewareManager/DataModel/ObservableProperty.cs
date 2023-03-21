using System.Text.Json;

namespace MiddlewareManager.DataModel;

public partial class ObservableProperty
{
    public string Name { get; set; }
    public PropertyOf? PropertyOf { get; set; }
    public int frequency { get; set; }
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