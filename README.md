# Useful Commands

## pushing a new version
git tag -a egress/v1.0.2 -m "my version 1.0.0"
git push origin egress/v1.0.2
### information about pipeline metadata
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
kubectl create token service-orchestrator
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
          - kafka-0.kafka-headless.kafka:9092
```
### deploy kowl (from /Master/kafka)
```
helm install -f kafka/values.yaml kowl cloudhut/kowl -n sso
export POD_NAME=$(kubectl get pods --namespace sso -l "app.kubernetes.io/name=kowl,app.kubernetes.io/instance=kowl" -o jsonpath="{.items[0].metadata.name}")
echo "Visit http://127.0.0.1:8087 to use your application"
kubectl --namespace sso port-forward $POD_NAME 8087:8080
```

### Launch producer
```
kubectl run kafka-producer -ti --image=quay.io/strimzi/kafka:0.32.0-kafka-3.3.1 --rm=true --restart=Never -- bin/kafka-console-producer.sh --bootstrap-server my-cluster-kafka-bootstrap:9092 --topic my-topic
```

### Launch consumer
```
kubectl run kafka-consumer -ti --image=quay.io/strimzi/kafka:0.32.0-kafka-3.3.1 --rm=true --restart=Never -- bin/kafka-console-consumer.sh --bootstrap-server my-cluster-kafka-bootstrap:9092 --topic my-topic --from-beginning
```

## Launch test ingress and egress
```
kubectl apply -f sample_setups/ingress/ingress.yaml
kubectl apply -f sample_setups/egress/egress.yaml

```

## kill them again
```
kubectl delete -f sample_setups/ingress/ingress.yaml
kubectl delete -f sample_setups/egress/egress.yaml
```

