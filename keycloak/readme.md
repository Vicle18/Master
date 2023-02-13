see: https://strimzi.io/blog/2019/10/25/kafka-authentication-using-oauth-2.0/

or rather:
https://strimzi.io/docs/operators/0.32.0/configuring.html#con-mapping-keycloak-authz-services-to-kafka-model_authz-model

# Setup for a secure kafka with keycloak
## Generate relevant certificates, including root certificate and signed certificates for keycloak using the following script
## Only if there are no certificates, otherwise not necessary
./certificate_gen.sh 

## Save the generated certificates and private key as a kubernetes secret
kubectl create secret tls tls-keys -n sso \
  --cert=./keycloak.crt --key=./keycloak.key

## Make a copy of the certificate for the kafka broker to save in the trust store, i.e. its a certificate the broker will trust
cp ./keycloak.crt ./sso.crt

## Start the keycloak server, it will use the private key and certificate in form of secrets
kubectl apply -f keycloak.yaml -n sso
#### Current problem is, that the port forward fails after a minute or two, to increase time on mac, use in the same console
ulimit -n 65536 
### To access keycloak, you need to port forward
kubectl port-forward -n sso service/keycloak 8443:8443


##### Then you can open keycloak here:
Remember to enable trust for the keycloak certificate, to do so, open the keycloak folder in finder, double press
on the keycloak.crt certificate, then keychain access wil open. Now double click on the keycloak certificate that is not trusted yet,
then you open "trust" and set "when using this certificate" to Always Trust, then close the window.

https://localhost:8444/auth
user/password: admin
then load the realm export found in this folder!

## The following is probably not used
<!-- # create a secret for kafka authentication
NS=sso
kubectl run -ti --restart=Never --image=quay.io/strimzi/kafka:0.32.0-kafka-3.3.1 kafka-cli -n $NS -- /bin/sh

SSO_HOST=<< host name of keycloak >>
SSO_HOST_PORT=$SSO_HOST:8443
STOREPASS=storepass

echo "Q" | openssl s_client -showcerts -connect $SSO_HOST_PORT 2>/dev/null | awk ' /BEGIN CERTIFICATE/,/END CERTIFICATE/ { print $0 } ' > /tmp/sso.crt -->

## Create a secret containing the certificate of keycloak for the kafka broker to use
kubectl create secret generic oauth-server-cert --from-file=./sso.crt -n sso

## Start the kafka broker setup, but replace the environment variables with the host and port of the keycloak server
cat ./kafka-ephemeral-oauth-single-keycloak-authz.yaml | sed -E 's#\${SSO_HOST}'"#keycloak:8443#" | kubectl create -n sso -f -

### To follow the start of kafka, it can take some time!
kubectl get pods -n sso -w

### To see the logs of the kafka broker
kubectl logs my-cluster-kafka-0 -f -n sso 

## To test kafka the following setup can be used
### if required, delete the previous test pod
kubectl delete pod kafka-cli -n sso

### Then start a testin pod, that has kafka preloaded
kubectl run -ti --restart=Never --image=quay.io/strimzi/kafka:0.32.0-kafka-3.3.1 kafka-cli -n sso -- /bin/sh

### Then extract the certificate of the keycloak server and store it in the keystore
SSO_HOST=keycloak

SSO_HOST_PORT=$SSO_HOST:8443

STOREPASS=storepass

echo "Q" | openssl s_client -showcerts -connect $SSO_HOST_PORT 2>/dev/null | awk ' /BEGIN CERTIFICATE/,/END CERTIFICATE/ { print $0 } ' > /tmp/sso.crt

keytool -keystore /tmp/truststore.p12 -storetype pkcs12 -alias sso -storepass $STOREPASS -import -file /tmp/sso.crt -noprompt

### Then do the same with the Kafka broker certificate
KAFKA_HOST_PORT=my-cluster-kafka-bootstrap:9093

STOREPASS=storepass

echo "Q" | openssl s_client -showcerts -connect $KAFKA_HOST_PORT 2>/dev/null | awk ' /BEGIN CERTIFICATE/,/END CERTIFICATE/ { print $0 } ' > /tmp/my-cluster-kafka.crt

keytool -keystore /tmp/truststore.p12 -storetype pkcs12 -alias my-cluster-kafka -storepass $STOREPASS -import -file /tmp/my-cluster-kafka.crt -noprompt

### Now you have to create the config files for the users

#### Team A Client
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
##### Produce
bin/kafka-console-producer.sh --bootstrap-server my-cluster-kafka-bootstrap:9093 --topic a_messages --producer.config /tmp/team-a-client.properties
First message

##### Consume
bin/kafka-console-consumer.sh --bootstrap-server my-cluster-kafka-bootstrap:9093 --topic a_topic --from-beginning --consumer.config /tmp/team-a-client.properties --group a_consumer_group_a

### Team B
cat > /tmp/team-b-client.properties << EOF
security.protocol=SASL_SSL
ssl.truststore.location=/tmp/truststore.p12
ssl.truststore.password=$STOREPASS
ssl.truststore.type=PKCS12
sasl.mechanism=OAUTHBEARER
sasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required \
  oauth.client.id="team-b-client" \
  oauth.client.secret="team-b-client-secret" \
  oauth.ssl.truststore.location="/tmp/truststore.p12" \
  oauth.ssl.truststore.password="$STOREPASS" \
  oauth.ssl.truststore.type="PKCS12" \
  oauth.token.endpoint.uri="https://$SSO_HOST/auth/realms/kafka-authz/protocol/openid-connect/token" ;
sasl.login.callback.handler.class=io.strimzi.kafka.oauth.client.JaasClientOauthLoginCallbackHandler
EOF

### Alice (Admin)
USERNAME=alice
PASSWORD=alice-password

GRANT_RESPONSE=$(curl -X POST "https://$SSO_HOST/auth/realms/kafka-authz/protocol/openid-connect/token" -H 'Content-Type: application/x-www-form-urlencoded' -d "grant_type=password&username=$USERNAME&password=$PASSWORD&client_id=kafka-cli&scope=offline_access" -s -k)

REFRESH_TOKEN=$(echo $GRANT_RESPONSE | awk -F "refresh_token\":\"" '{printf $2}' | awk -F "\"" '{printf $1}')

cat > /tmp/alice.properties << EOF
security.protocol=SASL_SSL
ssl.truststore.location=/tmp/truststore.p12
ssl.truststore.password=$STOREPASS
ssl.truststore.type=PKCS12
sasl.mechanism=OAUTHBEARER
sasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required \
  oauth.refresh.token="$REFRESH_TOKEN" \
  oauth.client.id="kafka-cli" \
  oauth.ssl.truststore.location="/tmp/truststore.p12" \
  oauth.ssl.truststore.password="$STOREPASS" \
  oauth.ssl.truststore.type="PKCS12" \
  oauth.token.endpoint.uri="https://$SSO_HOST/auth/realms/kafka-authz/protocol/openid-connect/token" ;
sasl.login.callback.handler.class=io.strimzi.kafka.oauth.client.JaasClientOauthLoginCallbackHandler
EOF

bin/kafka-topics.sh --bootstrap-server my-cluster-kafka-bootstrap:9093 --command-config /tmp/alice.properties --topic a_messages --create --replication-factor 1 --partitions 1