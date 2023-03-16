using System.Diagnostics;
using System.Drawing.Printing;
using k8s;
using k8s.Models;
using Serilog;

namespace ServiceOrchestrator.ContainerManagement.Kubernetes;

public class KubernetesManager : IContainerManager
{
    private readonly IConfiguration _config;
    private readonly ILogger<KubernetesManager> _logger;
    private k8s.Kubernetes client;

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
        client = new k8s.Kubernetes(config);
        _logger.LogDebug("active pods in kubernetes: {pods}", string.Join(", ", client.ListNamespacedPod("sso").Items.Select(p => p.Name())));
    }


    public void StartContainer(ContainerConfig config)
    {
        string uniqueId = Guid.NewGuid().ToString("N");
        var pod = CreateV1Pod(config, uniqueId);
        var createdPod = client.CreateNamespacedPod(pod, "sso");
        _logger.LogDebug("created {pod}", createdPod.Metadata.ToString());
    }

    private static V1Pod CreateV1Pod(ContainerConfig config, string uniqueId)
    {
        var pod = new V1Pod
        {
            Metadata = new V1ObjectMeta
            {
                Name = $"pod-{uniqueId}"
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

    public void StopContainer(string id)
    {
    }
}