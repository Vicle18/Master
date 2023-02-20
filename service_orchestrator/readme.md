to enable the service orchestrator to interact with kubernetes, the service account 
called `service-orchestrator` needs to be created. This service account is created
by running the "create_service_account.sh" script. This script creates a service account
and a token.
Then you have to copy the token to the appsettings.json folder or set it as an environment variable with key: KUBERNETES_ACCESS_TOKEN.

When running the service orchestrator inside kubernetes, a different config has to be used, i think its called KubernetesClientConfiguration.InClusterConfig();, because then it will be supplied by kubernetes as a volume.