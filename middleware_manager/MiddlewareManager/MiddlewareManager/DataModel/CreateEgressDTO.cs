namespace MiddlewareManager.DataModel;

public class CreateEgressDto: CreateDTO
{
    public string name { get; set; }

    public string description { get; set; }

    public string protocol { get; set; }

    public List<ObservableProperty> observables { get; set; }

    public string dataFormat { get; set; }
}