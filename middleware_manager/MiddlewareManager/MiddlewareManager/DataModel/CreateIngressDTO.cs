using System.Text.Json;

namespace MiddlewareManager.DataModel;

public class CreateIngressDto:CreateIngressDtoBase
{
    public string protocol { get; set; }

    public string? host { get; set; }
    
    public string? topic { get; set; }

    public string? port { get; set; }
    
    public string? output { get; set; }

    public string? nodeId { get; set; }
    
    public Dictionary<string, JsonElement>? metadata { get; set; }

    public override string ToString()
    {
        return $"Create Ingress DTO, name: {name}, description: {description}";
    }
}