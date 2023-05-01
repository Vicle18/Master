import paho.mqtt.client as mqtt
import time
import sys

passed = False
def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe("testEgress")

def on_message(client, userdata, msg):
    print(msg.topic + " " + str(msg.payload))
    print(str(msg.payload.decode("utf-8")))
    if msg.topic == "testEgress" and str(msg.payload.decode("utf-8")) == "testMessage":
        global passed 
        passed = True
        

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("localhost", 1883, 60)

client.loop_start()
while(client.is_connected() == False):
    pass

client.publish("testIngress", "testMessage")
start_time = time.time()
while time.time() - start_time < 20 and passed == False:
    pass

client.disconnect()
if(passed):
    print("Test passed.")
    sys.exit(0)
else:
    print("Timeout reached, test failed.")
    sys.exit(1)