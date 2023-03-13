# Useful Commands

## pushing a new version
git tag -a ingress/v0.1.0 -m "my version 0.1.0"
git push origin ingress/v0.1.0
### informatio about pipeline metadata
https://github.com/docker/metadata-action
## Start of Kubernetes Cluster based on configuration file (cd to root of experiments)
```
kind create cluster --config kubernetes/kind_config.yaml 
```


## Create kafka namespace
```
kubectl create -f ./kubernetes/create_kafka_namespace.yaml
```

## Set default namespace to kafka
```
kubectl config set-context --current --namespace=sso
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

<!-- ### deploy kafka
```
kubectl apply -f kafka/kafka-persistent-single-oauth.yaml -n sso
``` -->

<!-- ### Launch producer
```
kubectl run kafka-producer -ti --image=quay.io/strimzi/kafka:0.32.0-kafka-3.3.1 --rm=true --restart=Never -- bin/kafka-console-producer.sh --bootstrap-server my-cluster-kafka-bootstrap:9092 --topic my-topic
```

### Launch consumer
```
kubectl run kafka-consumer -ti --image=quay.io/strimzi/kafka:0.32.0-kafka-3.3.1 --rm=true --restart=Never -- bin/kafka-console-consumer.sh --bootstrap-server my-cluster-kafka-bootstrap:9092 --topic my-topic --from-beginning
``` -->
