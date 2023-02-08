# Dockerfile for python
FROM python:3.9.16-bullseye

# Required for librdkafka
RUN apt update && apt -y install software-properties-common gcc
RUN git clone https://github.com/edenhill/librdkafka
RUN cd librdkafka && ./configure && make && make install && ldconfig
# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the code
COPY . .

# Run the app
CMD ["sh", "setup.sh"]