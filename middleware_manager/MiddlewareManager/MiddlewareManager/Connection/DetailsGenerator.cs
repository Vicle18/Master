using System.Net;
using System.Net.Sockets;
using MiddlewareManager.DataModel;
using Newtonsoft.Json;

namespace MiddlewareManager.Protocols;

public static class DetailsGenerator
{
    private static int counter = 0;

    public static string GeneratePort()
    {
        TcpListener
            listener = new TcpListener(IPAddress.Loopback, 0); // use IPAddress.Any to listen on all network interfaces
        listener.Start();
        return ((IPEndPoint)listener.LocalEndpoint).Port.ToString();
    }

    public static string GenerateHost()
    {
        var uri = $"127.0.0.1/egress/adapter-{counter}";
        counter++;
        return uri;
    }
    public static string GenerateServerUrl()
    {
        var uri = $"opc.tcp://172.17.0.1:8888/freeopcua/server/";
        return uri;
    }
    
    public static string GenerateNodeName()
    {
        var nodename = $"ns=6;s=::AsGlobalPV:MoveAssemblyPart";
        return nodename;
    }
    
    public static string GenerateEgressTarget(CreateEgressDto dto)
    {
        switch (dto.protocol)
        {
            case "MQTT":
                return $"{dto.name}-{Guid.NewGuid().ToString()}";
            case "OPCUA":
                return JsonConvert.SerializeObject(new object[]
                {
                    new
                    {
                        NODE_NAME = $"{dto.nodeId ?? GenerateNodeName()}",
                        VALUE_TYPE = $"{dto.datatype ?? "int"}",
                    }
                });
            default:
                throw new ArgumentException("Could not create egress target for protocol: {protocol}", dto.protocol);
        }
    }
}