namespace MiddlewareManager.DataModel;

public class CreateIngressDtoBase:CreateDTO
{
    public string name { get; set; }
    public string description { get; set; }

    public string containingElement { get; set; }
    public int frequency { get; set; }
    public int? changedFrequency { get; set; }
    public string dataFormat { get; set; }

    public override string ToString()
    {
        return $"Create Ingress DTO, name: {name}, description: {description}";
    }
}