# Use an official Python runtime as the base image.
FROM python:3.9-alpine

# Set the working directory in the container.
WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the Python script into the container.
COPY server.py .

# Expose port 5000 for the Flask API.
EXPOSE 5000

# Start the Python script when the container runs.
CMD ["python", "./server.py"]
