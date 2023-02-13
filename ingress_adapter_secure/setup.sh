### extract the certificate of the keycloak server and store it in the keystore
SSO_HOST=keycloak
SSO_HOST_PORT=$SSO_HOST:8443
STOREPASS=storepass
echo "Q" | openssl s_client -showcerts -connect $SSO_HOST_PORT 2>/dev/null | awk ' /BEGIN CERTIFICATE/,/END CERTIFICATE/ { print $0 } ' > /tmp/sso.crt

### Then do the same with the Kafka broker certificate
KAFKA_HOST_PORT=my-cluster-kafka-bootstrap:9093
STOREPASS=storepass
echo "Q" | openssl s_client -showcerts -connect $KAFKA_HOST_PORT 2>/dev/null | awk ' /BEGIN CERTIFICATE/,/END CERTIFICATE/ { print $0 } ' > /tmp/my-cluster-kafka.crt

cat > /tmp/ca.crt << EOF
-----BEGIN CERTIFICATE-----
MIICqDCCAZACCQChCpMxHK+EsTANBgkqhkiG9w0BAQsFADAWMRQwEgYDVQQDDAtl
eGFtcGxlLmNvbTAeFw0yMzAyMDYxNzUwMzBaFw0zMzAyMDMxNzUwMzBaMBYxFDAS
BgNVBAMMC2V4YW1wbGUuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC
AQEA2ixW0IQ+xJczC2uJzptxEfhF/OY7J1t1ts3hUJuX0oNomdrU8Ba67dtfFyvP
Y0MD3lirxCHukDEfZA05xm6t14BYFCi7avuC74nefmU+Yc3kJ3noiPKVPQar1mhl
YS7wqm8tZ7dIoE+K9FKIFPvMqK1cueDsgVXQvGX57QHuKWvM8M7HWP5v22zj1/4V
rX/bpigGkPm7k+KrR4OL9HPHkcJILd0S4AkSaJQZQlmczHH01JISaQX/Qpf/e0H3
H+n+4keP4qO6nXTSgyQj85EAViwRx9J98TBvBxwu7ArDdy1dlDW+UAPvO9EzTx1A
iKS0EQy9kR8sbu5ytQxa6UP9GwIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQBZgPL+
laqDBGsG1pducuIsSm09oKWstGaGgAJTJ+YPddQNiOss/DDvpZuEQ5qRE1EeeqqJ
NWO44oGdZGsBrIFl0ChrmIqjQwx4ReR1a3sQiadvVUQjtdIz1V0bflI0WCZHfH3h
Ocy6hcKBR/zvzjgyXHdQ+r6l3Ike+fJlg3AoExg6HGBqdkOFST18Y36qeDNRGLFJ
Kw3WDb9Y/5Lu9Zr2tCtKjc7Cda2x/3H4I7b9qkYfMcAwUHhPwadrmdbKDvfVoZiJ
iOgupEPOtibcibuEv9BvlmdWFB6Zqh7ezgVA2KxbFBJu1MIOxZ1OMhoX0tiHBkGv
MAwWYdi/AMc1m4Je
-----END CERTIFICATE-----
EOF

cat /tmp/my-cluster-kafka.crt
cp /tmp/my-cluster-kafka.crt /usr/share/ca-certificates/
cp /tmp/my-cluster-kafka.crt /etc/ssl/certs/
cp /tmp/ca.crt /usr/share/ca-certificates/
cp /tmp/ca.crt /etc/ssl/certs/
echo my-cluster-kafka.crt >> /etc/ca-certificates.conf
echo ca.crt >> /etc/ca-certificates.conf
update-ca-certificates
export SSL_CERT_FILE=/tmp/ca.crt

### Start application
echo "starting ingress adapter"
python oauth_ingress_adapter.py