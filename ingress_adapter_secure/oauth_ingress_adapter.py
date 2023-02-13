#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Copyright 2020 Confluent Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


# This uses OAuth client credentials grant:
# https://www.oauth.com/oauth2-servers/access-tokens/client-credentials/
# where client_id and client_secret are passed as HTTP Authorization header

import logging
import functools
import argparse
import time
from confluent_kafka import Producer
from confluent_kafka.serialization import StringSerializer
import requests


def _get_token(args, config):
    """Note here value of config comes from sasl.oauthbearer.config below.
    It is not used in this example but you can put arbitrary values to
    configure how you can get the token (e.g. which token URL to use)
    """
    payload = {
        'grant_type': 'client_credentials',
        # 'scope': ' '.join(args.scopes)
    }
    print('Getting token from {} with payload {}'.format(args.token_url, payload))
    
    try:
        resp = requests.post(args.token_url,
                         auth=(args.client_id, args.client_secret),
                         data=payload, verify="tmp/ca.crt")
    except requests.exceptions.RequestException as e:
        print('Failed to get token: {}'.format(e))
        return None, 0
    token = resp.json()
    print('Got token: {}'.format(token))
    return token['access_token'], time.time() + float(token['expires_in'])


def producer_config(args):
    logger = logging.getLogger(__name__)
    return {
        'bootstrap.servers': args.bootstrap_servers,
        'security.protocol': 'sasl_ssl',
        'sasl.mechanisms': 'OAUTHBEARER',
        'ssl.ca.location': 'tmp/my-cluster-kafka.crt',
        'ssl.certificate.location': 'tmp/my-cluster-kafka.crt',
        # sasl.oauthbearer.config can be used to pass argument to your oauth_cb
        # It is not used in this example since we are passing all the arguments
        # from command line
        # 'sasl.oauthbearer.config': 'not-used',
        'oauth_cb': functools.partial(_get_token, args),
        'logger': logger,
        'message.timeout.ms': 3000,
    }


def delivery_report(err, msg):
    """
    Reports the failure or success of a message delivery.

    Args:
        err (KafkaError): The error that occurred on None on success.

        msg (Message): The message that was produced or failed.

    Note:
        In the delivery report callback the Message.key() and Message.value()
        will be the binary format as encoded by any configured Serializers and
        not the same object that was passed to produce().
        If you wish to pass the original object(s) for key and value to delivery
        report callback we recommend a bound callback or lambda where you pass
        the objects along.

    """
    if err is not None:
        print('Delivery failed for User record {}: {}'.format(msg.key(), err))
        return
    print('User record {} successfully produced to {} [{}] at offset {}'.format(
        msg.key(), msg.topic(), msg.partition(), msg.offset()))


def main(args):
    topic = args.topic
    delimiter = args.delimiter
    producer_conf = producer_config(args)
    producer = Producer(producer_conf)
    serializer = StringSerializer('utf_8')

    print('Producing records to topic {}. ^C to exit.'.format(topic))
    while True:
        # Serve on_delivery callbacks from previous calls to produce()
        producer.poll(0.0)
        try:
            msg_data = "testmessage"
            msg = msg_data.split(delimiter)
            if len(msg) == 2:
                producer.produce(topic=topic,
                                 key=serializer(msg[0]),
                                 value=serializer(msg[1]),
                                 on_delivery=delivery_report)
            else:
                producer.produce(topic=topic,
                                 value=serializer(msg[0]),
                                 on_delivery=delivery_report)
            time.sleep(1)
        except KeyboardInterrupt:
            break

    try:
        print('\nFlushing {} records...'.format(len(producer)))
        producer.flush()
    except (KeyboardInterrupt, KafkaError, _MSG_TIMED_OUT) as e:
        print('Failed to flush records: {}'.format(e))
        print('\nAborted flush')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="OAUTH example with client credentials grant")
    parser.add_argument('-b', dest="bootstrap_servers", default="my-cluster-kafka-bootstrap:9093",
                        help="Bootstrap broker(s) (host[:port])")
    parser.add_argument('-t', dest="topic", default="a_topic",
                        help="Topic name")
    parser.add_argument('-d', dest="delimiter", default="|",
                        help="Key-Value delimiter. Defaults to '|'"),
    parser.add_argument('--client', dest="client_id", default="team-a-client",
                        help="Client ID for client credentials flow")
    parser.add_argument('--secret', dest="client_secret", default="team-a-client-secret",
                        help="Client secret for client credentials flow.")
    parser.add_argument('--token-url', dest="token_url", default="https://keycloak:8443/auth/realms/kafka-authz/protocol/openid-connect/token",
                        help="Token URL.")
    parser.add_argument('--scopes', dest="scopes", default="", nargs='+',
                        help="Scopes requested from OAuth server.")

    main(parser.parse_args())


    # parser = argparse.ArgumentParser(description="OAUTH example with client credentials grant")
    # parser.add_argument('-b', dest="bootstrap_servers", required=True,
    #                     help="Bootstrap broker(s) (host[:port])")
    # parser.add_argument('-t', dest="topic", default="example_producer_oauth",
    #                     help="Topic name")
    # parser.add_argument('-d', dest="delimiter", default="|",
    #                     help="Key-Value delimiter. Defaults to '|'"),
    # parser.add_argument('--client', dest="client_id", required=True,
    #                     help="Client ID for client credentials flow")
    # parser.add_argument('--secret', dest="client_secret", required=True,
    #                     help="Client secret for client credentials flow.")
    # parser.add_argument('--token-url', dest="token_url", required=True,
    #                     help="Token URL.")
    # parser.add_argument('--scopes', dest="scopes", required=True, nargs='+',
    #                     help="Scopes requested from OAuth server.")

    # main(parser.parse_args())