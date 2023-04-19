using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
using System.Text.Json;
using MiddlewareManager.DataModel;
using Newtonsoft.Json;
using NuGet.Packaging;
using Serilog;

namespace MiddlewareManager.Protocols;

public class ConnectionDetailsFactory
{
    private static int counter = 0;

    public static IConnectionDetails Create(string id, IngressDTOBase value, string topicName)
    {
        Log.Debug("WHAHHAHTHSAJH");
        Log.Debug(value.ToString());
        Log.Debug("protocol" + value.protocol);
        switch (value.protocol)
        {

            case "MQTT":
                return new MQTTConnectionDetails
                {
                    ID = id,
                    PROTOCOL = value.protocol,
                    PARAMETERS = new MQTTParameters
                    {
                        HOST = value.host,
                        PORT = value.port.ToString(),
                        TRANSMISSION_PAIRS = $"{value.topic}:{topicName}",
                        FREQUENCY = value.frequency.ToString(),
                        CHANGED_FREQUENCY = value.changedFrequency.ToString() ?? value.frequency.ToString(),
                        DATA_FORMAT = value.dataFormat,
                    }
                };
            case "RTDE":
                return new RTDEConnectionDetails
                {
                    ID = id,
                    PROTOCOL = value.protocol,
                    PARAMETERS = new RTDEParameters()
                    {
                        HOST = value.host,
                        PORT = value.port.ToString(),
                        TRANSMISSION_PAIRS = $"{value.output}:{topicName}",
                        FREQUENCY = value.frequency.ToString(),
                        CHANGED_FREQUENCY = value.changedFrequency.ToString() ?? value.frequency.ToString(),
                        DATA_FORMAT = value.dataFormat,
                    }
                };
            case "OPCUA":
                return new OPCUAConnectionDetails
                {
                    ID = id,
                    PROTOCOL = value.protocol,
                    PARAMETERS = new OPCUAParameters
                    {
                        SERVER_URL = value.host,
                        TRANSMISSION_PAIRS = JsonConvert.SerializeObject(new object[]
                        {
                            new
                            {
                                NODE_NAME = $"{value.nodeId}",
                                VALUE_TYPE = $"{value.dataFormat}",
                                ORIGIN_TOPIC = $"{value.topic}"
                            }
                        }),
                        DATA_FORMAT = value.dataFormat,
                    }
                };
            default:
                throw new ArgumentException("Unsupported protocol");
        }
    }


    public static IConnectionDetails Create(string id, CreateEgressDto value, ObservableProperty property)
    {
        Log.Debug("details");
        Log.Debug(value.protocol);
        var topicName = $"{value.name}-{Guid.NewGuid().ToString()}";
        var transmissionDetails = new TransmissionDetails()
        {
            FREQUENCY = value.frequency.ToString(),
            CHANGED_FREQUENCY = value.changedFrequency.ToString() ?? value.frequency.ToString(),
            DATA_FORMAT = value.dataFormat,
            ORIGIN_TOPIC = property.topic.name,
            TARGET = CreateEgressTarget(value),
            DOWN_SAMPLING_METHOD = value.downSamplingMethod,
            METADATA = value.metadata
        };
        switch (value.protocol)
        {
            case "MQTT":
                return new MQTTConnectionDetails
                {
                    ID = id,
                    PROTOCOL = value.protocol,
                    PARAMETERS = new MQTTParameters
                    {
                        HOST = value.host ?? GenerateHost(),
                        PORT = value.port ?? GeneratePort(),
                    },
                    TRANSMISSION_DETAILS = transmissionDetails
                };
            case "OPCUA":
                return new OPCUAConnectionDetails
                {
                    ID = id,
                    PROTOCOL = value.protocol,
                    PARAMETERS = new OPCUAParameters
                    {
                        SERVER_URL = GenerateHost(),
                    },
                    TRANSMISSION_DETAILS = transmissionDetails
                };
            default:
                throw new ArgumentException("Unsupported protocol");
        }
    }

    private static string CreateEgressTarget(CreateEgressDto dto)
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
                        NODE_NAME = $"{dto.nodeId}",
                        VALUE_TYPE = $"{dto.datatype}",
                    }
                });
            default:
                throw new ArgumentException("Could not create egress target for protocol: {protocol}", dto.protocol);
        }
    }
    
    

    private static string GeneratePort()
    {
        TcpListener
            listener = new TcpListener(IPAddress.Loopback, 0); // use IPAddress.Any to listen on all network interfaces
        listener.Start();
        return ((IPEndPoint)listener.LocalEndpoint).Port.ToString();
    }

    private static string GenerateHost()
    {
        var uri = $"127.0.0.1/egress/adapter-{counter}";
        counter++;
        return uri;
    }
}