using System.ComponentModel.DataAnnotations;

namespace MiddlewareManager.DataModel;

public class UpdateIngressDto: IngressDTOBase
{
    
    public string? id { get; set; }
    
    public override string ToString()
    {
        return $"Update Observation DTO, name: {name}, description: {description}, id: {id}, containingElement: {containingElement}";
    }
}