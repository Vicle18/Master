namespace WatchDog.Models;

public class ObservableProperty
{
    public Topic topic { get; set; }

    public string? status { get; set; }

    public string? lastUpdatedAt { get; set; }

    public string? errorStateAt { get; set; }
}

public class Topic
{
    public string name { get; set; }
}