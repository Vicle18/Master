import paho.mqtt.client as mqtt
import uuid
import time

# Define MQTT broker parameters
broker_address = "localhost"
broker_port = 8088
topic = "experiment"
frequency = 1000
# Create MQTT client instance
client = mqtt.Client()

# Connect to the MQTT broker
client.connect(broker_address, broker_port)

# Set loop start time
start_time = time.time()

# Publish a new message to the MQTT broker every 1/200 seconds
while True:
    # Generate a new UUID
    uuid_str = str(uuid.uuid4())

    # Publish the UUID to the MQTT broker
    client.publish(topic, uuid_str)

    # Sleep for 1/200 seconds before publishing the next message
    elapsed_time = time.time() - start_time
    next_pub_time = 1 / frequency - elapsed_time % (1 / frequency)
    time.sleep(next_pub_time)