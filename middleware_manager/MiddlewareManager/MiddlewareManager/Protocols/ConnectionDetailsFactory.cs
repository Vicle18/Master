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
        Log.Debug(value.ToString());
        Log.Debug("protocol" + value.protocol);

        switch (value.protocol)
        {
            case "RTDE": return RTDE.CreateRTDEIngressConnection(id, value, topicName);
            case "OPCUA": return new OPCUA(id, value);
            case "MQTT": return MQTT.CreateMqttIngressConnection(id, value, topicName);
            default:
                throw new ArgumentException("Unsupported protocol");
        }

        /*var connectionDetails = new ParameterDetails
        {
            FREQUENCY = value.frequency.ToString(),
            CHANGED_FREQUENCY = value.changedFrequency.ToString() ?? value.frequency.ToString(),
            DATA_FORMAT = value.dataFormat,
            HOST = value.host,
            PORT = value.port.ToString(),
            TRANSMISSION_PAIRS = ExtractTransmissionPairs(value, topicName)
        };

        return new MQTTConnectionDetails
        {
            ID = id,
            PROTOCOL = value.protocol,
            PARAMETERS = connectionDetails,
        };*/
        //TRANSMISSION_PAIRS = $"{value.topic}:{topicName}",

        /*switch (value.protocol)
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
        }*/
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
            TARGET = DetailsGenerator.GenerateEgressTarget(value),
            DOWN_SAMPLING_METHOD = value.downSamplingMethod,
            METADATA = value.metadata
        };
        switch (value.protocol)
        {
            case "MQTT": return MQTT.CreateMqttEgressConnection(id, value, transmissionDetails);
            case "RTDE": return RTDE.CreateRTDEEgressConnection(id, value, transmissionDetails)
        }

        // switch (value.protocol)
        // {
        //     case "MQTT":
        //         return new MQTTConnectionDetails
        //         {
        //             ID = id,
        //             PROTOCOL = value.protocol,
        //             PARAMETERS = new MQTTParameters
        //             {
        //                 HOST = value.host ?? GenerateHost(),
        //                 PORT = value.port ?? GeneratePort(),
        //             },
        //             TRANSMISSION_DETAILS = transmissionDetails
        //         };
        //     case "OPCUA":
        //         return new OPCUAConnectionDetails
        //         {
        //             ID = id,
        //             PROTOCOL = value.protocol,
        //             PARAMETERS = new OPCUAParameters
        //             {
        //                 SERVER_URL = GenerateHost(),
        //             },
        //             TRANSMISSION_DETAILS = transmissionDetails
        //         };
        //     default:
        //         throw new ArgumentException("Unsupported protocol");
        // }
        return null;
    }
    
}