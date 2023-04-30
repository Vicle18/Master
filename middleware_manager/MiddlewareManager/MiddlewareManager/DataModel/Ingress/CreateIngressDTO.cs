using System.Text.Json;

namespace MiddlewareManager.DataModel;

public class CreateIngressDto : IngressDTOBase
{

    


    public override string ToString()
    {
        return
            $"CreateEgress Ingress DTO, protocol: {protocol}, datatype: {dataType}, downsampleMethod: {downsampleMethod}, host: {host}, topic: {topic}, port: {port}, output: {output}, nodeId: {nodeId}, frequency: {frequency}, changedFrequency: {changedFrequency}";
    }
}