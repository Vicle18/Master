


export function CreateTelegramTemplate(host: string, port: string, topic: string): string {
    return `# Read metrics from MQTT topic(s)
    [[inputs.mqtt_consumer]]
      ## Broker URLs for the MQTT server or cluster.  To connect to multiple
      ## clusters or standalone servers, use a separate plugin instance.
      ##   example: servers = ["tcp://localhost:1883"]
      ##            servers = ["ssl://localhost:1883"]
      ##            servers = ["ws://localhost:1883"]
      servers = ["tcp://${host}:${port}"]
    
      ## Topics that will be subscribed to.
      topics = [
        "${topic}",

      ]
    
      ## The message topic will be stored in a tag specified by this value.  If set
      ## to the empty string no topic tag will be created.
      # topic_tag = "topic"
    
      ## QoS policy for messages
      ##   0 = at most once
      ##   1 = at least once
      ##   2 = exactly once
      ##
      ## When using a QoS of 1 or 2, you should enable persistent_session to allow
      ## resuming unacknowledged messages.
      # qos = 0
    
      ## Connection timeout for initial connection in seconds
      # connection_timeout = "30s"
    
      ## Maximum messages to read from the broker that have not been written by an
      ## output.  For best throughput set based on the number of metrics within
      ## each message and the size of the output's metric_batch_size.
      ##
      ## For example, if each message from the queue contains 10 metrics and the
      ## output metric_batch_size is 1000, setting this to 100 will ensure that a
      ## full batch is collected and the write is triggered immediately without
      ## waiting until the next flush_interval.
      # max_undelivered_messages = 1000
    
      ## Persistent session disables clearing of the client session on connection.
      ## In order for this option to work you must also set client_id to identify
      ## the client.  To receive messages that arrived while the client is offline,
      ## also set the qos option to 1 or 2 and don't forget to also set the QoS when
      ## publishing.
      # persistent_session = false
    
      ## If unset, a random client ID will be generated.
      # client_id = ""
    
      ## Username and password to connect MQTT server.
      # username = "telegraf"
      # password = "metricsmetricsmetricsmetrics"
    
      ## Optional TLS Config
      # tls_ca = "/etc/telegraf/ca.pem"
      # tls_cert = "/etc/telegraf/cert.pem"
      # tls_key = "/etc/telegraf/key.pem"
      ## Use TLS but skip chain & host verification
      # insecure_skip_verify = false
    
      ## Data format to consume.
      ## Each data format has its own unique set of configuration options, read
      ## more about them here:
      ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md

      data_format = "value"
      data_type = "float"

      ## Enable extracting tag values from MQTT topics
      ## _ denotes an ignored entry in the topic path
      # [[inputs.mqtt_consumer.topic_parsing]]
      #   topic = ""
      #   measurement = ""
      #   tags = ""
      #   fields = ""
      ## Value supported is int, float, unit
      #   [[inputs.mqtt_consumer.topic.types]]
      #      key = type
      #[[outputs.influxdb_v2]]
      #  urls = [<Insert URL>]
      #  bucket = <insert bucket>
      #  organization = <insert organisation>
      #  token = <insert token>

    [[outputs.influxdb_v2]]
      urls = ["http://influxdb:8086"]
      bucket = "connexio"
      organization = "sdf"
      token = "I4H0VzIxpNg1jfa0k_QEfZBmIUfccoLjlhX4HhyPIiJR1dCNjFldaABg5dXk3T1dPIJquwCOsp1807DtQuGXjQ=="
      `
}