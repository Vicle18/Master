using System.Text.Json;

namespace MiddlewareManager.DataModel;

public class CreateIngressDto : IngressDTOBase
{
    public string? datatype { get; set; }

    public string? downsampleMethod { get; set; }



    public override string ToString()
    {
        return
            $"Create Ingress DTO, protocol: {protocol}, datatype: {datatype}, downsampleMethod: {downsampleMethod}, host: {host}, topic: {topic}, port: {port}, output: {output}, nodeId: {nodeId}, frequency: {frequency}, changedFrequency: {changedFrequency}";
    }
}