import json
from datetime import datetime
from dateutil import parser
import csv
# Open both files and read the logs into memory
for i in range(10):
    with open(f"egress_logs{i+1}.json") as f1, open(f"ingress_logs{i+1}.json") as f2:
        try:
            logs1 = [json.loads(line) for line in f1 if "message" in json.loads(line) and json.loads(line)["message"].replace(".", "", 1).isdigit()]
            logs2 = [json.loads(line) for line in f2 if "message" in json.loads(line) and json.loads(line)["message"].replace(".", "", 1).isdigit()]
        except Exception as e:
            print(e)
            continue


        print(len(logs1))
        # Initialize an empty list to store the time differences
        time_diffs = []

        # Loop through each log in the first file
        for log1 in logs1:
            # Get the "message" value from the current log in the first file
            # print(log1)
            message1 = log1["message"]
            # Loop through each log in the second file
            for log2 in logs2:
                # Check if the "message" value in the current log in the second file matches the one in the first file
                if log2["message"] == message1:
                    # Get the timestamps from both logs and calculate the time difference in milliseconds
                    time1 = timestamp = parser.isoparse(log1["@t"])
                    time2 = timestamp = parser.isoparse(log2["@t"])
                    time_diff = time1 - time2
                    # print(time_diff.total_seconds()*1000)

                    # time_diff = time2 - time1
                    # # Add the time difference to the list
                    time_diffs.append(time_diff.total_seconds()*1000)
                    break  # Once a match is found, break out of the loop and move to the next log in the first file

        # Print the list of time differences
        # print(time_diffs[0])

        with open("time_diffs.csv", "a", newline="\n") as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(time_diffs)

    #     time1 = datetime.strptime(log1["@t"][:-1]+"000", '%Y-%m-%dT%H:%M:%S.%f%z')
    # time2 = datetime.strptime(log2["@t"][:-1]+"000", '%Y-%m-%dT%H:%M:%S.%f%z')
