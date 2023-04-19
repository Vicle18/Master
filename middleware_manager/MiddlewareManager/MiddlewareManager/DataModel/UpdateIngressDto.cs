using System.ComponentModel.DataAnnotations;

namespace MiddlewareManager.DataModel;

public class UpdateIngressDto
{
    public string id { get; set; }

    [Microsoft.Build.Framework.Required] 
    public string containingElement { get; set; }

    [Microsoft.Build.Framework.Required]
    [RegularExpression(@"^(string|integer|float)$", ErrorMessage = "Invalid data format")]
    public string dataFormat { get; set; }

    [Microsoft.Build.Framework.Required]
    [Range(0, int.MaxValue)]
    public int frequency { get; set; }

    [RegularExpression(@"^\d+$", ErrorMessage = "Invalid changed frequency")]
    public int? changedFrequency { get; set; }

    [Microsoft.Build.Framework.Required]
    [RegularExpression(@"^(MQTT|HTTP)$", ErrorMessage = "Invalid protocol")]
    public string protocol { get; set; }

    [Microsoft.Build.Framework.Required] public string name { get; set; }

    [Microsoft.Build.Framework.Required] public string description { get; set; }

    [RegularExpression(@"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", ErrorMessage = "Invalid IP address")]
    public string? host { get; set; }

    [RegularExpression(@"^\d{1,5}$", ErrorMessage = "Invalid port")]
    public string? port { get; set; }

    [Microsoft.Build.Framework.Required] public string output { get; set; }

    [Microsoft.Build.Framework.Required] public string topic { get; set; }

    public string? nodeId { get; set; }

    public override string ToString()
    {
        return $"Create Observation DTO, name: {name}, description: {description}";
    }
}