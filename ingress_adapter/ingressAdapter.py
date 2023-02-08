from confluent_kafka import Producer
import socket
import time
print("Starting producer")
conf = {'bootstrap.servers': "my-cluster-kafka-bootstrap:9093",
        'client.id': socket.gethostname(),
        'security.protocol': 'SASL_SSL',
        'ssl.ca.location': './tmp/my-cluster-kafka.crt',
        'sasl.mechanism': 'OAUTHBEARER'
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
    print("Producing message to topic 'random'")
    producer.produce("a_topic", key="key", value="value",callback=acked)
    producer.poll(1)
    time.sleep(1)