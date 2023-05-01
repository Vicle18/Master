import requests

url = "https://localhost:7014/api/Ingress/{}"
input_file = "ids.txt"

# Read the IDs from the input file
with open(input_file, "r") as f:
    ids = [line.strip() for line in f]

for id in ids:
    delete_url = url.format(id)
    response = requests.delete(delete_url, verify=False)
    print(f"Deleted {delete_url}: {response.status_code} {response.content}")
