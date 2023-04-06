namespace MiddlewareManager.DataModel;

public class CreateContainingElementDTO
{
    public string? id { get; set; }
    public string name { get; set; }
    public string description { get; set; }
    public string type { get; set; }
    public string parent { get; set; }
    public string[] children { get; set; }
    public string[] observableProperties { get; set; }
}