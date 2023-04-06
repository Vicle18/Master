namespace MiddlewareManager.DataModel;

public abstract class CreateDTO
{
    public string name { get; set; }
    public string description { get; set; }

    public string? host { get; set; }


    public string? port { get; set; }

    public string? nodeName { get; set; }
    
    public List<ObservableProperty>? observables { get; set; }

}