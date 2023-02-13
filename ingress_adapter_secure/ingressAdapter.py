from confluent_kafka import Producer
import functools
import socket
import time
print("Starting producer")

def get_token(args, config) :
        payload = {
                'grant_type': 'client_credentials',
                'scope': ' '.join(args.scopes)
        }
        resp = requests .post(args.token_url, auth=(args.client_id, args.client_secret),data=payload)
        token = resp.json()
        return token['access_token'], time.time() + float (token[ 'expires_in' ])


conf = {'bootstrap.servers': "my-cluster-kafka-bootstrap:9093",
        'client.id': "ingress-adapter",
        'security.protocol': 'SASL_SSL',
        'ssl.ca.location': './tmp/my-cluster-kafka.crt',
        'sasl.mechanism': 'OAUTHBEARER',
        'oauth_cb': functools.partial(get_token, 'team-a-client', 'team-a-client-secret')
        }
print("Creating producer") 




producer = Producer(conf)



def acked(err, msg):
    if err is not None:
        print("Failed to deliver message: %s: %s" % (str(msg), str(err)))
    else:
        print("Message produced: %s" % (str(msg)))

print("Starting loop") 
while True:
    print("Producing message to topic 'a_topic'")
    producer.produce("a_topic", key="key", value="value",callback=acked)
    producer.poll(1)
    producer.flush()
    time.sleep(1)

