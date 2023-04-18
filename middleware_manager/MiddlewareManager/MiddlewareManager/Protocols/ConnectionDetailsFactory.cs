using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
using MiddlewareManager.DataModel;
using Newtonsoft.Json;
using NuGet.Packaging;
using Serilog;

namespace MiddlewareManager.Protocols;

public class ConnectionDetailsFactory
{
    private static int counter = 0;

    public static IConnectionDetails Create(string id, CreateIngressDto value, string topicName)
    {
        
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
                        PORT = value.port,
                        TRANSMISSION_PAIRS = $"{value.topic}:{topicName}",
                        FREQUENCY = value.frequency.ToString(),
                        CHANGED_FREQUENCY = value.changedFrequency.ToString() ?? value.frequency.ToString(),
                        DATA_FORMAT = value.dataFormat,
                        METADATA = value.metadata
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
                        PORT = value.port,
                        TRANSMISSION_PAIRS = $"{value.output}:{topicName}",
                        FREQUENCY = value.frequency.ToString(),
                        CHANGED_FREQUENCY = value.changedFrequency.ToString() ?? value.frequency.ToString(),
                        DATA_FORMAT = value.dataFormat,
                        METADATA = value.metadata
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
                                NODE_NAME = $"{value.nodeName}",
                                VALUE_TYPE = $"{value.dataFormat}",
                                ORIGIN_TOPIC = $"{value.topic}"
                            }
                        }),
                        DATA_FORMAT = value.dataFormat,
                        METADATA = value.metadata
                    }
                };
            default:
                throw new ArgumentException("Unsupported protocol");
        }
    }


    public static IConnectionDetails Create(string id, CreateEgressDto value, string topicName, ObservableProperty observableProperty)
    {
        Log.Debug("details");
        Log.Debug(value.protocol);
        Log.Debug(observableProperty.topic.name.ToString());
        Log.Debug(topicName);
        string target = 
        var transmissionDetails = new TransmissionDetails()
        {
            FREQUENCY = value.frequency.ToString(),
            CHANGED_FREQUENCY = value.changedFrequency.ToString() ?? value.frequency.ToString(),
            DATA_FORMAT = value.dataFormat,
            ORIGIN_TOPIC = topicName,
            TARGET = value.protocol == 
        }
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
                        TRANSMISSION_PAIRS = $"{observableProperty.topic.name}:{topicName}" ?? GenerateTransmissionPairs(),
                    }
                };
            case "OPCUA":
                return new OPCUAConnectionDetails
                {
                    ID = id,
                    PROTOCOL = value.protocol,
                    PARAMETERS = new OPCUAParameters
                    {
                        SERVER_URL = GenerateHost(),
                        TRANSMISSION_PAIRS = JsonConvert.SerializeObject(new object[]
                        {
                            new
                            {
                                NODE_NAME = $"{value.nodeName}",
                                VALUE_TYPE = $"{value.dataFormat}",
                                ORIGIN_TOPIC = $"{observableProperty.topic.name}"
                            }
                        })
                    }
                };
            default:
                throw new ArgumentException("Unsupported protocol");
        }
    }

    private static string CreateEgressTarget(CreateEgressDto dto,ObservableProperty observableProperty )
    {
        switch (dto.protocol)
        {
            case "MQTT":
                return $"{}"
        }
    }


    private static string GenerateTransmissionPairs()
    {
        throw new NotImplementedException();
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