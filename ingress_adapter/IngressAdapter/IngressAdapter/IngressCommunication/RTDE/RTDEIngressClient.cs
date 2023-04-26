
using System.Runtime.CompilerServices;
using IngressAdapter.DataModel;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Serilog;
using Ur_Rtde;

namespace IngressAdapter.IngressCommunication.RTDE;

public class RTDEIngressClient : IIngressClient
{
    private readonly IConfiguration _config;
    private RtdeClient client;
    private readonly RTDEConfiguration _rtdeConfig;
    private Action<string> _messageHandler;
    private string _statusMessage = "";
    public RTDEIngressClient(IConfiguration config)
    {
        _config = config;
        
        _rtdeConfig = new RTDEConfiguration();
        _config.GetSection("INGRESS_CONFIG").GetSection("PARAMETERS").Bind(_rtdeConfig);
    }

    public async Task<bool> Initialize(Action<string> messageHandler)
    {
        try
        {
            _messageHandler = messageHandler;
            Log.Debug("trying to connect to  RTDE Server");
            client = new RtdeClient();
            client.OnSockClosed += new EventHandler(OnSockClosed);

            var connected = client.Connect(_rtdeConfig.HOST,2);
            Log.Debug("connection: {connected}", connected);
            return true;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            _statusMessage =
                $"Could not connect to RTDE Client with host {_rtdeConfig.HOST} and port {_rtdeConfig.PORT}, {e.Message}";
            throw;
        }
        
    }
    
    private void OnSockClosed(object sender, EventArgs e)
    {
        Log.Debug( "Closed socket for RTDE Streaming");
    }

    public void StartIngestion(TransmissionDetails _transmissionDetails)
    {
        try
        {
            Log.Debug("Starting RTDE Stream");
            var values = new Dictionary<string, object>();
            
                values.Add(_rtdeConfig.OUTPUT, CreateTempObjectBasedOnType(MapOutputToType(_rtdeConfig.OUTPUT)));

                var post = new DynamicEntity(values);
            dynamic outputObject = post;
            Log.Debug( $"{values}");
            var initResponse = client.Setup_Ur_Outputs(values, Int16.Parse(_transmissionDetails.FREQUENCY)); 
            
            Log.Debug( "Setting up outputs, received: {response}", initResponse);
            client.OnDataReceive += new EventHandler(OnDataReceive);

            // Request the UR to send back Outputs periodically
            client.Ur_ControlStart();
        }
        catch (Exception e)
        {
            Log.Debug("Error when starting ingestion for RTDE: {error}", e.Message);
        }
    }

    public bool IsConnected()
    {
        return client?.IsConnected() ?? false;
    }

    public string GetStatusMessage()
    {
        throw new NotImplementedException();
    }

    private string MapOutputToType(string output)
    {
        switch (output)
        {
            case "timestamp":
                return "double";
            case "actual_q":
                return "double_array";
            case "joint_temperatures":
                return "double_array";
            case "robot_mode":
                return "int";
            default:
                throw new ArgumentException($"Could not identify type for output: {output}");
        }
    }

    private object CreateTempObjectBasedOnType(string type)
    {
        switch (type)
        {
            case "double":
                return 3.3;
            case "double_array":
                return new double[6];
            case "int":
                return new int();
            case "int_array":
                return new int[6];
            default:
                return new object();
        }
    }
    
    private void OnDataReceive(object sender, EventArgs e)
    {
        
        Console.WriteLine($"received {JsonConvert.SerializeObject(client.UrStructOuput)} via RTDE");
        Log.Debug("received {data} via RTDE", JsonConvert.SerializeObject(client.UrStructOuput));

        foreach (var pair in client.UrStructOuput)
        {
            _messageHandler( JsonConvert.SerializeObject(pair.Value));
        }
    }

}