kubectl delete deployment ingress-adapter
docker build -t ingress .
kind load docker-image ingress
kubectl apply -n sso -f deployment.yaml

POD=`kubectl get pod -n sso | grep ingress | awk '{ print $1 }'` 
kubectl logs $POD -n sso -f
