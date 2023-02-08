### extract the certificate of the keycloak server and store it in the keystore
SSO_HOST=keycloak
SSO_HOST_PORT=$SSO_HOST:8443
STOREPASS=storepass
echo "Q" | openssl s_client -showcerts -connect $SSO_HOST_PORT 2>/dev/null | awk ' /BEGIN CERTIFICATE/,/END CERTIFICATE/ { print $0 } ' > /tmp/sso.crt

### Then do the same with the Kafka broker certificate
KAFKA_HOST_PORT=my-cluster-kafka-bootstrap:9093
STOREPASS=storepass
echo "Q" | openssl s_client -showcerts -connect $KAFKA_HOST_PORT 2>/dev/null | awk ' /BEGIN CERTIFICATE/,/END CERTIFICATE/ { print $0 } ' > /tmp/my-cluster-kafka.crt

### Start application
python ingressAdapter.py