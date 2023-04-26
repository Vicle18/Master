using System.Text;
using IngressAdapter.DataModel;
using Microsoft.Extensions.Configuration;
using Opc.Ua;
using Opc.Ua.Client;
using Opc.Ua.Configuration;
using Serilog;

namespace IngressAdapter.IngressCommunication.OPCUA;

public class OPCUAIngressClient : IIngressClient
{
    private readonly IConfiguration _config;
    private Session _session;
    private OPCUAConfiguration _opcuaConfig;
    private Action<string> _messageHandler;
    private string _statusMessage = "";

    private string ServerUrl;

    public OPCUAIngressClient(IConfiguration config)
    {
        _config = config;
        _opcuaConfig = new OPCUAConfiguration();
        _config.GetSection("INGRESS_CONFIG").GetSection("PARAMETERS").Bind(_opcuaConfig);
    }
    public async Task<bool> Initialize(Action<string> messageHandler)
    {
        _messageHandler = messageHandler;
        await CreateClientSession(_opcuaConfig.SERVER_URL);
        return true;
    }

    public void StartIngestion(TransmissionDetails _transmissionDetails)
    {
        while (!HasConnection())
        {
            Task.Delay(3000).Wait();
            Log.Debug("OPC UA Client has no connection");
        }

        Task.Run((Action) (async () =>
        {
            Log.Debug("Starting Ingestion");
            try
            {
                // Create a subscription for the node with the external method as the FastDataChangeCallback
                var subscription = new Subscription(_session.DefaultSubscription) {PublishingInterval = int.Parse(_transmissionDetails.FREQUENCY)}; // change the publish interval to increase fetching rate
                var monitoredItem = new MonitoredItem(subscription.DefaultItem)
                {
                    StartNodeId = _opcuaConfig.NODE_NAME, 
                    MonitoringMode = MonitoringMode.Reporting,
                    SamplingInterval = 100,
                    
                };
                subscription.AddItem(monitoredItem);
                subscription.FastDataChangeCallback = MyFastDataChangeCallback;
                _session.AddSubscription(subscription);
                await subscription.CreateAsync();
                subscription.ApplyChanges();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            
        })).ConfigureAwait(false);

    }

    public bool IsConnected()
    {
        return _session?.Connected ?? false;
    }

    public string GetStatusMessage()
    {
        throw new NotImplementedException();
    }

    private void MyFastDataChangeCallback(Subscription subscription, DataChangeNotification notification, IList<string> stringTable)
    {
        try
        {
            
            Log.Debug("Value of OPCUA Node: {node} changed to: {value}", subscription.MonitoredItems.First().StartNodeId.Identifier ,notification.MonitoredItems[0].Value.Value);
            _messageHandler(notification.MonitoredItems[0].Value.Value.ToString()!);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
        
    }
    
    public bool HasConnection()
    {
        return _session?.Connected ?? false;
    }

    public void Disconnect()
    {
        _session.Dispose();
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
                    _statusMessage =
                        $"Connection to client with url {endpointUrlString}, could not be established because of error: {e.Message}";
                    Thread.Sleep(1000);
                }
            }
        })).ConfigureAwait(false);
    }
}