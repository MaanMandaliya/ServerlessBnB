import json
import boto3
from register import register


def lambda_handler(event, context):

    statuscode = None
    message = None

    http_method = event['requestContext']['http']['method']
    path = event['requestContext']['http']['path']

    if 'body' in event:
        body = json.loads(event['body'])

    if http_method == 'POST':
        if body:
            if path == '/register':
                response = register(body)
                return send_return(response)


def send_return(response):
    return {
        'statusCode': 200,
        'body': response
    }
