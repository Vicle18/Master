# Use an official Python runtime as the base image.
FROM python:3.9-alpine

# Set the working directory in the container.
WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the Python script into the container.
COPY mqtt_producer.py .

# Start the Python script when the container runs.
CMD ["python", "./mqtt_producer.py"]
