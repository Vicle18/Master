namespace WatchDog.Models;

public class ObservableProperty
{
    public string id { get; set; }

    public string? status { get; set; }

    public string? lastUpdatedAt { get; set; }

    public string? errorStateAt { get; set; }
}