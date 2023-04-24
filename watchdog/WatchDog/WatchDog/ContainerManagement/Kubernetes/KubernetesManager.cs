using System.Text.Json;
using k8s;
using k8s.Models;
using Serilog;

namespace WatchDog.ContainerManagement.Kubernetes;

public class KubernetesManager : IContainerManager
{
    private readonly IConfiguration _config;
    private readonly ILogger<KubernetesManager> _logger;
    private k8s.Kubernetes _client;
    private string _uniqueId = "";
    private bool _isBrokerCreated = false;
    private int _timeOfLastRequest = 0;
    private KubernetesClientConfiguration _kubeconfig;

    public KubernetesManager(IConfiguration config, ILogger<KubernetesManager> logger)
    {
        _config = config;
        _logger = logger;
        _logger.LogCritical("starting the kubernetes manager");
        Initialize();
    }

    public void Initialize()
    {
        _logger.LogCritical("Initializing KubernetesManager");
        var host = _config.GetSection("KUBERNETES_CONFIG").GetValue<string>("KUBERNETES_HOST");
        var accessToken = _config.GetSection("KUBERNETES_CONFIG").GetValue<string>("KUBERNETES_ACCESS_TOKEN");
        _logger.LogDebug("{accessToken}, {host}", accessToken, host);
        _kubeconfig = new KubernetesClientConfiguration
        {
            Host = host,
            AccessToken = accessToken,
            SkipTlsVerify = true,
            Namespace = "sso",
        };
        _client = new k8s.Kubernetes(_kubeconfig);
        _logger.LogDebug("active pods in kubernetes: {pods}",
            string.Join(", ", _client.ListNamespacedPod("sso").Items.Select(p => p.Name())));
        CheckStatusUpdate();
    }

    public void CheckStatusUpdate()
    {
        _timeOfLastRequest = DateTimeOffset.UtcNow.Second;
        Log.Debug(_timeOfLastRequest.ToString());
        Log.Debug("insider");
        while (true)
        {
           
            if (_timeOfLastRequest + 5 < DateTimeOffset.UtcNow.Second)
            {
                Log.Debug("inside if");

                // Create a new Kubernetes client

                // Create a new instance of the PodsV1Api class
                var pods = _client.ListNamespacedPod("sso");
                foreach (var pod in pods)
                {
                    Log.Debug(pod.Name());
                }

                _timeOfLastRequest = DateTimeOffset.UtcNow.Second;
                // Retrieve a list of all pods in the current namespace
                //var list = api.ListNamespacedPod("default");
            }
        }
    }
}