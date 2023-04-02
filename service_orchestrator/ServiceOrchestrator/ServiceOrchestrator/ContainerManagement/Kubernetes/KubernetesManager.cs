using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;
using k8s;
using k8s.Models;
using Serilog;
using ServiceOrchestrator.Brokers;

namespace ServiceOrchestrator.ContainerManagement.Kubernetes;

public class KubernetesManager : IContainerManager
{
    private readonly IConfiguration _config;
    private readonly ILogger<KubernetesManager> _logger;
    private k8s.Kubernetes _client;
    private string uniqueId = "";
    private bool isBrokerCreated = false;

    public KubernetesManager(IConfiguration config, ILogger<KubernetesManager> logger)
    {
        _config = config;
        _logger = logger;
        _logger.LogCritical("starting the kubernetes manager");
        Initialize();
    }

    private void Initialize()
    {
        _logger.LogCritical("Initializing KubernetesManager");
        var host = _config.GetSection("KUBERNETES_CONFIG").GetValue<string>("KUBERNETES_HOST");
        var accessToken = _config.GetSection("KUBERNETES_CONFIG").GetValue<string>("KUBERNETES_ACCESS_TOKEN");
        _logger.LogDebug("{accessToken}, {host}", accessToken, host);
        var config = new KubernetesClientConfiguration
        {
            Host = host,
            AccessToken = accessToken,
            SkipTlsVerify = true,
            Namespace = "sso",
        };
        // var config = KubernetesClientConfiguration.BuildDefaultConfig();
        _client = new k8s.Kubernetes(config);
        _logger.LogDebug("active pods in kubernetes: {pods}",
            string.Join(", ", _client.ListNamespacedPod("sso").Items.Select(p => p.Name())));
    }


    public async Task StartContainer(string id, ContainerConfig config)
    {
        // string uniqueId = Guid.NewGuid().ToString("N");
        var pod = CreateV1Pod(config, id);
        var createdPod = await _client.CreateNamespacedPodAsync(pod, "sso");
        _logger.LogDebug("created {pod}", createdPod.Metadata.ToString());
    }

    private static V1Pod CreateV1Pod(ContainerConfig config, string uniqueId)
    {
        Log.Debug("INSIDE CREATEV1");
        Log.Debug(JsonSerializer.Serialize(config));
        var pod = new V1Pod
        {
            Metadata = new V1ObjectMeta
            {
                Name = $"pod-{config.ImageName.Split("/").Last().Split(":").First()}-{uniqueId}",
                Labels = new Dictionary<string, string>
                {
                    { "app", "egress-adapters" }
                }
            },
            Spec = new V1PodSpec
            {
                Containers = new List<V1Container>
                {
                    new V1Container
                    {
                        Name = $"container-{uniqueId}",
                        Image = config.ImageName,
                        //Converting env from dictionary to list
                        Env = config.EnvironmentVariables.Select(pair => new V1EnvVar
                        {
                            Name = pair.Key,
                            Value = pair.Value
                        }).ToList()
                    }
                }
            }
        };
        return pod;
    }

    public async Task StopContainer(string id)
    {
        await _client.DeleteNamespacedPodAsync(
            name: $"pod-{id}",
            namespaceParameter: "sso",
            body: new V1DeleteOptions { PropagationPolicy = "Background" });
    }

    public async void StartContainerBroker(ContainerConfig config, string protocol)
    {
        if (protocol == "MQTT" && !isBrokerCreated)
        {
            MQTTBroker mqttBroker = new MQTTBroker();
            V1Service service = mqttBroker.createService(config, uniqueId);
            V1Pod pod = mqttBroker.createPod(config, uniqueId);
            var podResult = _client.CreateNamespacedPod(pod, "sso");
            var serviceResult = _client.CreateNamespacedService(service, "sso");
            isBrokerCreated = true;
        }
        //TODO Create OPCUA broker and 
    }


    public void StopContainerBroker(string id)
    {
        throw new NotImplementedException();
    }
}