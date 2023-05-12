import json
from datetime import datetime
from dateutil import parser
import csv

def read_logs(log_file):
    with open(log_file) as f:
        for line in f:
            try:
                log = json.loads(line)
                if "message" in log and log["message"][0].isdigit():
                    yield log
            except json.decoder.JSONDecodeError:
                continue

def write_time_diffs_to_csv(time_diffs):
    print("adding ", len(time_diffs), " time diffs to csv")
    with open("time_diffs.csv", "a", newline="\n") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(time_diffs)

for i in range(1):
    print(i)
    logs1 = read_logs(f"egress_logs{i+1}.json")
    logs2 = read_logs(f"ingress_logs{i+1}.json")

    time_diffs = []
    message_to_timestamp = {}

    # Build a dictionary of message to timestamp mappings for the logs in the second file
    for log2 in logs2:
        message2 = log2["message"]
        timestamp2 = parser.isoparse(log2["@t"])
        message_to_timestamp[message2] = timestamp2

    # Calculate the time difference for each log in the first file that has a match in the second file
    for log1 in logs1:
        message1 = log1["message"]
        if message1 in message_to_timestamp:
            timestamp1 = parser.isoparse(log1["@t"])
            time_diff = (timestamp1 - message_to_timestamp[message1]).total_seconds() * 1000
            time_diffs.append(time_diff)

    write_time_diffs_to_csv(time_diffs)
