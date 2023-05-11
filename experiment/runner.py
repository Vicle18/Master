import requests

urlIngress = "https://localhost:7014/api/Ingress"
urlEgress = "https://localhost:7014/api/Egress"
frequency = 300
output_file = "ids.txt"

# Clear the output file
with open(output_file, "w") as f:
    f.truncate(0)

for i in range(2):
    payload = {
        "name": f"TestProperty{i+1}",
        "description": f"description{i+1}",
        "containingElement": "Robot 1",
        "dataType": "NUMBER",
        "output": "timestamp",
        "host": "172.17.0.1",
        "port": "30004",
        "protocol": "RTDE",
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

    