using System.Text.Json;

namespace DataExplorer.Repository;

public class TopicQueryResponse
{
    public ObservablePropertiesResult ObservableProperties { get; set; }
    public override string ToString()
    {
        return JsonSerializer.Serialize(this);
    }
}
public class ObservablePropertiesResult
{
    public List<ObservableProperty> ObservableProperties { get; set; }
}

public partial class ObservableProperty
{
    public Topic topic { get; set; }
}

public class Topic
{
    public string name { get; set; }

    public override string ToString()
    {
        return JsonSerializer.Serialize(this);
    }
}