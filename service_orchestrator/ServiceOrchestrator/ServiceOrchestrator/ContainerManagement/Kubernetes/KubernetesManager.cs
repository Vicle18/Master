using System.Drawing.Printing;
using k8s;
using k8s.Models;

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
        //StartContainer(new ContainerConfig());
        _logger.LogDebug("active pods in kubernetes: {pods}", string.Join(", ", client.ListNamespacedPod("sso").Items.Select(p => p.Name())));
    }



    public void StartContainer(ContainerConfig config)
    {
        var pod = new V1Pod
        {
            Metadata = new V1ObjectMeta
            {
                Name = "first-pod2"
            },
            Spec = new V1PodSpec
            {
                Containers = new List<V1Container>
                {
                    new V1Container
                    {
                        Name = "my-container2",
                        Image = "clemme/egress:latest",
                        Env = new List<V1EnvVar>
                        {
                            new V1EnvVar
                            {
                                Name = "MY_ENV_VAR",
                                Value = "my-value"
                            }
                        }
                    }
                }
            }
        };
        var createdPod = client.CreateNamespacedPod(pod, "sso");
        _logger.LogDebug("created {pod}", createdPod.Metadata.ToString());
    }

    public void StopContainer(string id)
    {
        
    }
    
}