using IngressAdapter.DataModel;
using Microsoft.Extensions.Configuration;
using Serilog;

namespace IngressAdapter.IngressCommunication.REST;

public class RESTIngressClient: IIngressClient
{
    private readonly IConfiguration _config;
    private readonly RESTConfiguration _restConfig;
    private bool _isConnected = false;
    private string _statusMessage = "";
    private Action<string> _messageHandler;
    public RESTIngressClient(IConfiguration config)
    {
        _config = config;
        _restConfig = new RESTConfiguration();
        _config.GetSection("INGRESS_CONFIG").GetSection("PARAMETERS").Bind(_restConfig);
        Log.Debug("Received ingress config: {config}", _restConfig);

    }
    public async Task<bool> Initialize(Action<string> messageHandler)
    {
        _messageHandler = messageHandler;
        return true;
    }

    public void StartIngestion(TransmissionDetails transmissionDetails)
    {
        var cts = new CancellationTokenSource();
        
        var task = Task.Run(async () =>
        {
            Timer timer = new Timer(async state =>
        {
            try
            {
                using HttpClient client = new HttpClient();

                // Send the GET request and get the response content as a string
                string response = await client.GetStringAsync(_restConfig.SERVER_URL);
                Log.Debug(response);
                _isConnected = true;
                _statusMessage = "running";
                // Add the response to the list
                _messageHandler(response);
            }
            catch (HttpRequestException ex) // catch Http Request Exceptions, such as 404
            {
                // Set _isConnected to false and update the status message with the failure code
                _isConnected = false;
                _statusMessage = $"Error: {ex.StatusCode}";
                Log.Error(ex, "Could not send get request: {message}", ex.Message);

            }
            catch (Exception e)
            {
                _isConnected = false;
                _statusMessage = $"Error: {e.Message}";
                Log.Error(e, "Could not send get request: {message}", e.Message);
            }
            
        }, null, TimeSpan.Zero, TimeSpan.FromMilliseconds(1000/Int32.Parse(transmissionDetails.FREQUENCY)));

        while (!cts.Token.IsCancellationRequested)
        {
            await Task.Delay(1000);
        }
        }, CancellationToken.None);
    }

    public bool IsConnected()
    {
        return _isConnected;
    }

    public string GetStatusMessage()
    {
        return _statusMessage;
    }
}