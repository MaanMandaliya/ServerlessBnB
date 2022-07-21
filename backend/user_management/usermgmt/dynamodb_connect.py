import boto3


def connect_to_dynamo(table_name):
    dynamo_db = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamo_db.Table(table_name)
    return table
