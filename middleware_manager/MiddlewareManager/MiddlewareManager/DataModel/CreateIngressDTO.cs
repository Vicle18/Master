namespace MiddlewareManager.DataModel;

public class CreateIngressDTO
{
    public string name { get; set; }
    public string description { get; set; }

    public string endpointId { get; set; }

    public string protocol { get; set; }

    public string host { get; set; }
    
    public string topic { get; set; }

    public string port { get; set; }

    public string containingElement { get; set; }
    public string frequency { get; set; }
   // public string? changedFrequency { get; set; }
    public string dataFormat { get; set; }
    public string? nodeName { get; set; }

    public override string ToString()
    {
        return $"Create Ingress DTO, name: {name}, description: {description}";
    }
}