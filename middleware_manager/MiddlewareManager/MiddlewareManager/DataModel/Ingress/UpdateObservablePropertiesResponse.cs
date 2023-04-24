namespace MiddlewareManager.DataModel;

public class UpdateObservablePropertiesResponse
{
    public UpdateObservablePropertiesData Data { get; set; }
}

public class UpdateObservablePropertiesData
{
    public UpdateObservablePropertiesResult UpdateObservableProperties { get; set; }
}

public class UpdateObservablePropertiesResult
{
    public List<UpdateObservableProperty> ObservableProperties { get; set; }
}

public class UpdateObservableProperty
{
    public string Id { get; set; }
}