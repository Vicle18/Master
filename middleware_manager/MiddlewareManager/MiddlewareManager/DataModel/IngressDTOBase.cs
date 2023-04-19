namespace MiddlewareManager.DataModel;

public class IngressDTOBase:CreateDTO
{
    public string? name { get; set; }
    public string? description { get; set; }
    public string protocol { get; set; }
    public string? containingElement { get; set; }
    public int? frequency { get; set; }
    public int? changedFrequency { get; set; }
    public string dataFormat { get; set; }
    public string? host { get; set; }
    public string? output { get; set; }
    public int? port { get; set; }
    public string? nodeId { get; set; }
    public string? topic { get; set; }

    public override string ToString()
    {
        return $"Create Ingress DTO, name: {name}, description: {description}, protocol: {protocol}, containingElement: {containingElement}, frequency: {frequency}, changedFrequency: {changedFrequency}, dataFormat: {dataFormat}, host: {host}, output: {output}, port: {port}, nodeId: {nodeId}, topic: {topic}";
    }
}