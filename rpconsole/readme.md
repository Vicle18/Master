helm repo add redpanda-console 'https://dl.redpanda.com/public/console/helm/charts/'
helm repo update
helm install redpanda-console redpanda-console/console --values values.yaml -n sso
