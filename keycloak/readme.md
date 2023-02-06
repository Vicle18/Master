see: https://strimzi.io/blog/2019/10/25/kafka-authentication-using-oauth-2.0/

or rather:
https://strimzi.io/docs/operators/0.32.0/configuring.html#proc-oauth-authorization-keycloak-example_str
## Create the secret containing keys
./certificate_gen

kubectl create secret tls tls-keys -n sso \
  --cert=./keycloak.crt --key=./keycloak.key

cp ./keycloak.crt ./sso.crt

kubectl apply -f keycloak.yaml -n sso

# create a secret for kafka authentication
NS=sso
kubectl run -ti --restart=Never --image=quay.io/strimzi/kafka:0.32.0-kafka-3.3.1 kafka-cli -n $NS -- /bin/sh

SSO_HOST=<< host name of keycloak >>
SSO_HOST_PORT=$SSO_HOST:8443
STOREPASS=storepass

echo "Q" | openssl s_client -showcerts -connect $SSO_HOST_PORT 2>/dev/null | awk ' /BEGIN CERTIFICATE/,/END CERTIFICATE/ { print $0 } ' > /tmp/sso.crt

kubectl create secret generic oauth-server-cert --from-file=./sso.crt -n $NS

cat ./kafka-ephemeral-oauth-single-keycloak-authz.yaml | sed -E 's#\${SSO_HOST}'"#$SSO_HOST#" | kubectl create -n $NS -f -


cat ./kafka-ephemeral-oauth-single-keycloak-authz.yaml | sed -E 's#\${SSO_HOST}'"#10.96.85.10:8443#" | kubectl create -n sso -f - 
# above statement takes some time



## Current problem is, that the port forward fails after a minute or two, to increase time, use 
ulimit -n 65536 
## and then just keep restarting the port forward if failing (not sure what the problem is), others have the same problem
https://github.com/kubernetes/kubernetes/issues/74551
kubectl port-forward -n sso service/keycloak 8443:8443 

## Then you can open keycloak here:
https://localhost:8443/auth
user/password: admin
then load the realm export found in this folder
the passwords for broker, producer and consumer must be recreated



## Produce messages
kubectl delete pod kafka-cli -n sso
kubectl run -ti --restart=Never --image=quay.io/strimzi/kafka:0.32.0-kafka-3.3.1 kafka-cli -n $NS -- /bin/sh

SSO_HOST=keycloak

SSO_HOST_PORT=$SSO_HOST:8443

STOREPASS=storepass

echo "Q" | openssl s_client -showcerts -connect $SSO_HOST_PORT 2>/dev/null | awk ' /BEGIN CERTIFICATE/,/END CERTIFICATE/ { print $0 } ' > /tmp/sso.crt

keytool -keystore /tmp/truststore.p12 -storetype pkcs12 -alias sso -storepass $STOREPASS -import -file /tmp/sso.crt -noprompt

KAFKA_HOST_PORT=my-cluster-kafka-bootstrap:9093

STOREPASS=storepass

echo "Q" | openssl s_client -showcerts -connect $KAFKA_HOST_PORT 2>/dev/null | awk ' /BEGIN CERTIFICATE/,/END CERTIFICATE/ { print $0 } ' > /tmp/my-cluster-kafka.crt

keytool -keystore /tmp/truststore.p12 -storetype pkcs12 -alias my-cluster-kafka -storepass $STOREPASS -import -file /tmp/my-cluster-kafka.crt -noprompt

SSO_HOST=keycloak:8443

cat > /tmp/team-a-client.properties << EOF
security.protocol=SASL_SSL
ssl.truststore.location=/tmp/truststore.p12
ssl.truststore.password=$STOREPASS
ssl.truststore.type=PKCS12
sasl.mechanism=OAUTHBEARER
sasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required \
  oauth.client.id="team-a-client" \
  oauth.client.secret="team-a-client-secret" \
  oauth.ssl.truststore.location="/tmp/truststore.p12" \
  oauth.ssl.truststore.password="$STOREPASS" \
  oauth.ssl.truststore.type="PKCS12" \
  oauth.token.endpoint.uri="https://$SSO_HOST/auth/realms/kafka-authz/protocol/openid-connect/token" ;
sasl.login.callback.handler.class=io.strimzi.kafka.oauth.client.JaasClientOauthLoginCallbackHandler
EOF

bin/kafka-console-producer.sh --bootstrap-server my-cluster-kafka-bootstrap:9093 --topic amessages \
  --producer.config /tmp/team-a-client.properties
First message

bin/kafka-console-consumer.sh --bootstrap-server my-cluster-kafka-bootstrap:9093 --topic a_messages --from-beginning --consumer.config /tmp/team-a-client.properties --group x_consumer_group_a