# General Information
The following repository contains the source code created in connection with the Master thesis "Dynamic Configuration of Production Data Streams and Endpoints" by Victor Kyhe Clemmensen and Bende Siewertsen, written at the University of Southern Denmark in 2022/2023. 

The software architecture is based on microservices deployed in Kubernetes. A detailed description of the architecture can be found in the thesis. This repository contains the source code for all the services, as well as the configuration files for the Kubernetes cluster and other configuration files used to deploy the services and peripheral software like Kafka and KeyCloak.

More specifically, the repository contains the following services:
- Ingress Adapter in the folder "ingress_adapter"
- Egress Adapter in the folder "egress_adapter"
- Service Configurator in the folder "service_orchestrator"
- Middleware Manager in the folder "middleware_manager"
- Data Explorer in the folder "data_explorer"
- Watchdog in the folder "watchdog"
- Frontend in the folder "frontend"
- Meta Store in the folder "meta_store"

The dockerized services can be found on Docker Hub at the following links:
- Ingress Adapter: https://hub.docker.com/r/clemme/ingress
- Egress Adapter: https://hub.docker.com/r/clemme/egress
- Service Configurator: https://hub.docker.com/r/clemme/service-configurator
- Middleware Manager: https://hub.docker.com/r/clemme/middleware-manager
- Data explorer: https://hub.docker.com/r/clemme/data-explorer
- Watchdog: https://hub.docker.com/r/clemme/watchdog
- Meta store: https://hub.docker.com/r/clemme/meta-store
- Frontend: https://hub.docker.com/r/clemme/frontend

Furthermore, the repository contains the following folders:
- "kafka" contains the configuration files for deploying Kafka in Kubernetes
- "keycloak" contains the configuration files for deploying KeyCloak in Kubernetes
- "sample_setups" contains sample setups for deploying the services in Kubernetes and docker-compose
- "experiment" contains the code used for the experiments conducted in the thesis
- "analysis_results" contains the results of the experiments conducted in the thesis
- ".github/workflows" contains the configuration files for the GitHub Actions used to build the services

The rest of this document contains relevant code snippets and commands used to deploy the services and the peripheral software.
# Useful Commands

## pushing a new version
git tag -a frontend/v1.0.3 -m "now"
git push origin frontend/v1.0.3

git tag -a mvp -m "mvp"
git push origin mvp
### informatio about pipeline metadata
https://github.com/docker/metadata-action
## Start of Kubernetes Cluster based on configuration file (cd to root of experiments)
```
kind create cluster --config kubernetes/kind_config.yaml 
```


## Create sso namespace
```
kubectl create -f ./kubernetes/create_kafka_namespace.yaml
```

## Set default namespace to sso
```
kubectl config set-context --current --namespace=sso
```

## Create user to access kubernetes api
```
kubectl apply -f kubernetes/create_user.yaml
kubectl create token service-orchestrator --duration=720h  
```

## Deploy Strimzi Kafka on Kubernetes (cd to strimzi-0.32...)
for better description, see https://strimzi.io/docs/operators/latest/deploying.html

### replace namespace in cluster operator configuration to kafka
```
sed -i '' 's/namespace: .*/namespace: sso/' kafka/strimzi-0.32.0/install/cluster-operator/*RoleBinding*.yaml
```

### deploy cluster operator
```
kubectl create -f kafka/strimzi-0.32.0/install/cluster-operator -n sso
```

### deploy kafka
```
kubectl apply -f kafka/templates/kafka-ephemeral-single.yaml -n sso
```

### install kowl 
```
helm repo add cloudhut https://raw.githubusercontent.com/cloudhut/charts/master/archives
helm repo update
helm show values cloudhut/kowl > kafka/values.yaml
```
add/change configuration based on kafka installation, i.e. change values.yaml to include the following:
```
kowl:
  config: 
    kafka:
        brokers:
          - my-cluster-kafka-brokers:9092
```
### deploy kowl (from /Master/kafka)
```
helm install -f kafka/values.yaml kowl cloudhut/kowl -n sso
export POD_NAME=$(kubectl get pods --namespace sso -l "app.kubernetes.io/name=kowl,app.kubernetes.io/instance=kowl" -o jsonpath="{.items[0].metadata.name}")
echo "Visit http://127.0.0.1:8087 to use your application"
kubectl --namespace sso port-forward $POD_NAME 8087:8080


helm uninstall kowl
```

### Launch producer
```
kubectl run kafka-producer -ti --image=quay.io/strimzi/kafka:0.32.0-kafka-3.3.1 --rm=true --restart=Never -- bin/kafka-console-producer.sh --bootstrap-server my-cluster-kafka-bootstrap:9092 --topic robotStatus
```

### Launch consumer
```
kubectl run kafka-consumer -ti --image=quay.io/strimzi/kafka:0.32.0-kafka-3.3.1 --rm=true --restart=Never -- bin/kafka-console-consumer.sh --bootstrap-server my-cluster-kafka-bootstrap:9092 --topic my-topic --from-beginning
```

## Launch test ingress and egress
```
kubectl apply -f sample_setups/ingress/ingress.yaml
kubectl apply -f sample_setups/egress/egress.yaml

kubectl apply -f sample_setups/data_explorer/data_explorer.yaml

```

## kill them again
```
kubectl delete -f sample_setups/ingress/ingress.yaml
kubectl delete -f sample_setups/egress/egress.yaml
kubectl delete -f sample_setups/data_explorer/data_explorer.yaml
```

# Neo4j deployment
https://neo4j.com/docs/operations-manual/current/kubernetes/quickstart-standalone/create-value-file/ 
```
helm install my-neo4j-release neo4j/neo4j --namespace sso -f sample_setups/neo4j/my-neo4j.values.yaml
kubectl rollout status --watch --timeout=600s statefulset/my-neo4j-release

kubectl port-forward svc/my-neo4j-release tcp-bolt tcp-http tcp-https
```

## Access neo4j query engine
```
kubectl run --rm -it --namespace "sso" --image "neo4j:5.5.0" cypher-shell \
>      -- cypher-shell -a "neo4j://my-neo4j-release.sso.svc.cluster.local:7687" -u neo4j -p "bendevictor"
```

## delete neo4j
```
helm uninstall my-neo4j-release
```

## Metastore
```
kubectl apply -f sample_setups/neo4j/meta-store.yaml

export POD_NAME=$(kubectl get pods --namespace sso -l "app=meta-store" -o jsonpath="{.items[0].metadata.name}")
kubectl --namespace sso port-forward $POD_NAME 4000:4000


kubectl delete -f sample_setups/neo4j/meta-store.yaml

```

## Data explorer
```
kubectl apply -f sample_setups/data_explorer/data_explorer.yaml
export POD_NAME=$(kubectl get pods --namespace sso -l "app=data-explorer" -o jsonpath="{.items[0].metadata.name}")
kubectl --namespace sso port-forward $POD_NAME 8086:80

kubectl delete -f sample_setups/data_explorer/data_explorer.yaml

```

## Kill port forward
```
ps -ef|grep port-forward
kill
```

## Access pod
```
kubectl exec --stdin --tty pod-0d14ada6-3c87-4fe2-824e-74794f4e94d6 -- /bin/bash
```

## Copy file from pod to local
```
kubectl cp <pod-name>:<fully-qualified-file-name> /<path-to-your-file>/<file-name>

kubectl cp -n sso pod-0e832f4e-9f2a-4b86-a145-3209bc705575:Logs/log20230430.txt ~/logs/ingress_logs1.json

kubectl cp pod-0d14ada6-3c87-4fe2-824e-74794f4e94d6:Logs/log20230430.txt ~/logs/egress_logs1.json

```

## Kill 
## watch dog
```
kubectl apply -f sample_setups/watchdog/watchdog.yaml

kubectl delete -f sample_setups/watchdog/watchdog.yaml
```

## service configurator
```
kubectl apply -f sample_setups/service_configurator/service_configurator.yaml

export POD_NAME=$(kubectl get pods --namespace sso -l "app=service-configurator" -o jsonpath="{.items[0].metadata.name}")
kubectl --namespace sso port-forward $POD_NAME 8085:80

kubectl delete -f sample_setups/service_configurator/service_configurator.yaml
```

## middleware manager
```
kubectl apply -f sample_setups/middleware_manager/middleware_manager.yaml

export POD_NAME=$(kubectl get pods --namespace sso -l "app=middleware-manager" -o jsonpath="{.items[0].metadata.name}")
kubectl --namespace sso port-forward $POD_NAME 8082:80

kubectl delete -f sample_setups/middleware_manager/middleware_manager.yaml
```

## frontend
```
kubectl apply -f sample_setups/frontend/frontend.yaml

export POD_NAME=$(kubectl get pods --namespace sso -l "app=frontend" -o jsonpath="{.items[0].metadata.name}")
kubectl --namespace sso port-forward $POD_NAME 3001:3000

kubectl delete -f sample_setups/frontend/frontend.yaml
