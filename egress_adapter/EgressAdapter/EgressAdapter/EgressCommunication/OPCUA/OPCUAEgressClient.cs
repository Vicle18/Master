using EgressAdapter.BusCommunication;
using Microsoft.Extensions.Configuration;
using Opc.Ua;
using Opc.Ua.Client;
using Serilog;

namespace EgressAdapter.EgressCommunication.OPCUA;

public class OPCUAEgressClient : IEgressClient
{
    private readonly IConfiguration _config;
    private Session _session;
    private OPCUAConfiguration _opcuaConfig;
    public OPCUAEgressClient(IConfiguration config)
    {
        _config = config;
        _opcuaConfig = new OPCUAConfiguration();
        _config.GetSection("EGRESS_CONFIG").GetSection("PARAMETERS").Bind(_opcuaConfig);
    }
    public void Initialize(IBusClient busClient)
    {
        CreateClientSession(_opcuaConfig.SERVER_URL);
        foreach (var pair in _opcuaConfig.TRANSMISSION_PAIRS)
        {
            switch (pair.VALUE_TYPE)
            {
                case "int":
                    busClient.Subscribe(pair.ORIGIN_TOPIC, 
                        (topic, value) => 
                            WriteNumberToServer(pair.NODE_NAME, Int32.Parse(value))
                    );
                    break;
                case "bool":
                    busClient.Subscribe(pair.ORIGIN_TOPIC, 
                        (topic, value) => 
                            WriteBoolToServer(pair.NODE_NAME, Boolean.Parse(value))
                    );
                    break;
            }
            
        }
    }
    
    private async Task CreateClientSession(string endpointUrlString)
    {

        var retry = true;
        _session = null;
        await Task.Run((Action) (async () =>
        {
            while (retry || _session == null)
            {
                try
                {
                    Log.Debug("Creating client session with url: {endpointUrl}", endpointUrlString);

                    ApplicationConfiguration config = new ApplicationConfiguration();
                    config.ApplicationName = "My OPC UA Client";
                    config.ApplicationType = ApplicationType.Client;
                    config.CertificateValidator = new CertificateValidator();
                    config.CertificateValidator.CertificateValidation += (s, e) => { e.Accept = (e.Error.StatusCode == StatusCodes.BadCertificateUntrusted); };
                    config.ClientConfiguration = new ClientConfiguration();
                    config.ClientConfiguration.DefaultSessionTimeout = 60000;

                    // Create a new session with the server
                    var endpointUrl = new Uri(endpointUrlString);
                    var endpointConfig = CoreClientUtils.SelectEndpoint(endpointUrl.ToString(), false, 15000);
                    var endpointConfiguration = EndpointConfiguration.Create(config);
                    var endpoint = new ConfiguredEndpoint(null, endpointConfig, endpointConfiguration);
                    _session = await Session.Create(config, endpoint, false, "MySession", 60000, null, null);
                    retry = false;
                    Log.Debug( "connection to OPCUA: {connection}", HasConnection());

                }
                catch (Opc.Ua.ServiceResultException e)
                {
                    Log.Debug( e, "Connection to client with url {endpointUrl}, could not be established because of error: ", endpointUrlString, e.Message);
                    Thread.Sleep(1000);
                }
            }
        })).ConfigureAwait(false);
    }
    
    private void WriteBoolToServer(string nodeIdentifier, bool input)
    {
        Log.Debug( "Writing bool to server with nodeIdentifier {nodeIdentifier}, and input {inputBool}", nodeIdentifier, input);
        if (_session == null) throw new IOException("not connected");
        WriteValue(nodeIdentifier, new DataValue(input));
    }

    private void WriteNumberToServer(string nodeIdentifier, int input)
    {
        if (_session == null) throw new IOException("not connected");
        Log.Debug( "Writing number to server with nodeIdentifier {nodeIdentifier}, and input {inputNumber}", nodeIdentifier, input);
        Variant value = Convert.ToInt16(input);
        WriteValue(nodeIdentifier, new DataValue(value));
    }
    
    private void WriteValue(NodeId variableId, DataValue value)
    {
        if (_session == null) throw new IOException("not connected to OPCUA server");
        WriteValue nodeToWrite = new WriteValue
        {
            NodeId = variableId,
            AttributeId = Attributes.Value,
            Value = new DataValue
            {
                WrappedValue = value.WrappedValue
            }
        };

        WriteValueCollection nodesToWrite = new WriteValueCollection {
            nodeToWrite
        };

        StatusCodeCollection results = null;
        DiagnosticInfoCollection diagnosticInfos = null;

        ResponseHeader responseHeader = _session.Write(
            null,
            nodesToWrite,
            out results,
            out diagnosticInfos);

        ClientBase.ValidateResponse(results, nodesToWrite);
        ClientBase.ValidateDiagnosticInfos(diagnosticInfos, nodesToWrite);

        if (StatusCode.IsBad(results[0]))
        {
            throw ServiceResultException.Create(results[0], 0, diagnosticInfos, responseHeader.StringTable);
        }
            
    }
    
    public bool HasConnection()
    {
        return _session?.Connected ?? false;
    }
}