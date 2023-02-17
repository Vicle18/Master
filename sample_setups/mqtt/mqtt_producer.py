import paho.mqtt.client as mqtt
import random
import time
import os
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

# The client instance.
client = mqtt.Client()
client.on_connect = on_connect

host = os.environ.get('HOST') or "localhost"
port = os.environ.get('PORT') or 1883
# Connect to the broker.
client.connect(host, port, 60)

while True:
    # Generate a random number between 1 and 10.
    num = random.randint(1, 10)
    # Publish the number to the "example" topic.
    client.publish("example", str(num), qos=0)

    # Sleep for 1 second.
    time.sleep(1)
