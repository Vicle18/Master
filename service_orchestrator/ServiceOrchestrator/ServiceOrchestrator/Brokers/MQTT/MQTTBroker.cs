using k8s.Models;
using ServiceOrchestrator.ContainerManagement;

namespace ServiceOrchestrator.Brokers;

public class MQTTBroker : IMessageBroker
{
    public MQTTBroker()
    {
    }

    public V1Service createService(ContainerConfig config, string uniqueId)
    {
        // create a Service object
        var service = new V1Service
        {
            Metadata = new V1ObjectMeta
            {
                Name = $"mqtt-broker-{uniqueId}"
            },
            Spec = new V1ServiceSpec
            {
                Type = "NodePort",
                Ports = new List<V1ServicePort>
                {
                    new V1ServicePort
                    {
                        Name = "tcp",
                        NodePort = 30950,
                        Port = 1883,
                    },
                },
                Selector = new Dictionary<string, string>
                {
                    { "app", $"mqtt-broker-{uniqueId}" },
                },
            },
        };
        return service;
    }

    public V1Pod createPod(ContainerConfig config, string uniqueId)
    {
        // create a Pod object
        var pod = new V1Pod
        {
            Metadata = new V1ObjectMeta
            {
                Name = $"mqtt-broker-{uniqueId}",
                Labels = new Dictionary<string, string>
                {
                    { "app", $"mqtt-broker-{uniqueId}" },
                },
            },
            Spec = new V1PodSpec
            {
                Containers = new List<V1Container>
                {
                    new V1Container
                    {
                        Name = "mqtt-broker",
                        Image = "hivemq/hivemq-ce",
                        Ports = new List<V1ContainerPort>
                        {
                            new V1ContainerPort
                            {
                                Name = "mqtt",
                                ContainerPort = 1883,
                            },
                            new V1ContainerPort
                            {
                                Name = "mqtt-websockets",
                                ContainerPort = 9001,
                            },
                        },
                    },
                },
            },
        };
        return pod;
        // create the Pod in Kubernetes
        //var podResult = _client.CreateNamespacedPod(pod, "sso");
    }
}