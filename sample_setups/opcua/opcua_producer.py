import os
from opcua import Client
import random
import time

# get connection string from environment variable or use default value
opcua_server_url = os.environ.get("OPCUA_SERVER_URL", "opc.tcp://localhost:8888/freeopcua/server/")

# get node name from environment variable or use default value
node_name = os.environ.get("OPCUA_NODE_NAME", "ns=6;s=::AsGlobalPV:MoveAssemblyPart")

# get sleep time from environment variable or use default value
sleep_time = float(os.environ.get("OPCUA_SLEEP_TIME", "5"))

# check value type and set appropriate value
opcua_value_type = os.environ.get("OPCUA_VALUE", "int")
if opcua_value_type == "int":
    # get minimum and maximum values from environment variables or use default values
    min_value = int(os.environ.get("OPCUA_MIN_VALUE", 0))
    max_value = int(os.environ.get("OPCUA_MAX_VALUE", 10))
elif opcua_value_type == "string":
    # get list of string values from environment variable
    string_values = os.environ.get("OPCUA_STRING_VALUES", "this,that").split(",")
    if len(string_values) == 0:
        raise ValueError("OPCUA_STRING_VALUES environment variable must contain comma-separated list of strings")
elif opcua_value_type == "bool":
    pass
else:
    raise ValueError("OPCUA_VALUE environment variable must be one of 'int', 'string', or 'bool'")

# connect to OPC UA server
client = Client(opcua_server_url)
client.connect()

# get node object to write to
node = client.get_node(node_name)

# write value to node every sleep_time seconds
while True:
    if opcua_value_type == "int":
        value = random.randint(min_value, max_value)
    elif opcua_value_type == "string":
        # choose random string value from list
        value = random.choice(string_values)
    elif opcua_value_type == "bool":
        # choose random boolean value
        value = random.choice([True, False])
    node.set_value(value)
    print(f"Wrote value {value} to node {node}")
    time.sleep(sleep_time)
