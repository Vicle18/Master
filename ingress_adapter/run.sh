kubectl delete deployment ingress-adapter
docker build -t ingress .
kind load docker-image ingress
kubectl apply -n sso -f deployment.yaml