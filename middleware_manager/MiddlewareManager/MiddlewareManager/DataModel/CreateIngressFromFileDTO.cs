namespace MiddlewareManager.DataModel;

public class CreateIngressFromFileDTO : CreateIngressDtoBase
{
    public string id { get; set; }
    public string connectionDetails { get; set; }
    public string topic { get; set; }
}