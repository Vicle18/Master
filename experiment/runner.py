import requests

urlIngress = "https://localhost:7014/api/Ingress"
urlEgress = "https://localhost:7014/api/Egress"
frequency = 1000
output_file = "ids.txt"
# Clear the output file
with open(output_file, "w") as f:
    f.truncate(0)

for i in range(1):
    payload = {
        "name": f"TestProperty{i+1}",
        "description": f"description{i+1}",
        "containingElement": "Robot 1",
        "dataType": "NUMBER",
        "topic": "experiment",
        "host": "mqtt-broker-3909e2b4-8291-4e90-88f6-e2d692f29e5f",
        "port": "1883",
        "protocol": "MQTT",
        "frequency": frequency,
        "changedFrequency": frequency,
        "downsampleMethod": "Average",
        "dataFormat": "RAW"
    }
    response = requests.post(urlIngress, json=payload, verify=False)
    print(f"Request {i+1}: {response.status_code} {response.content}")
    response_json = response.json()
    id = response_json["createObservableProperties"]["observableProperties"][0]["id"]
    with open(output_file, "a") as f:
        f.write(f"{id}\n")

    payload = {
        "name": f"TestEgress{i+1}",
        "description": f"descriptionEgress{i+1}",
        "protocol":"MQTT",
        "groupId":"egressVisual",
        "frequency":frequency,
        "changedFrequency":frequency,
        "downSamplingMethod":"LATEST",
        "ingressId":id,
        "dataFormat":"RAW",
        "createBroker":True
    }
    response = requests.post(urlEgress, json=payload, verify=False)
    print(f"Request {i+1}: {response.status_code} {response.content}")
    response_json = response.json()
    id = response_json["createEgressEndpoints"]["egressEndpoints"][0]["id"]
    with open(output_file, "a") as f:
        f.write(f"{id}\n")

    