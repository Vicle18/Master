namespace WatchDog.Models;

public class EgressEndpoint
{
    public string id { get; set; }

    public string? name { get; set; }

    public string? description { get; set; }

    public string? connectionDetails { get; set; }

    public int? frequency { get; set; }

    public string? dataFormat { get; set; }

    public List<ObservableProperty>? accessTo { get; set; }

    public int? changedFrequency { get; set; }

    public string? egressGroup { get; set; }

    public string? status { get; set; }

    public string? lastUpdateAt { get; set; }

    public string? errorStateAt { get; set; }
}