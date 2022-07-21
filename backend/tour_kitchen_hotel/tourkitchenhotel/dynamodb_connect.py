import boto3
from boto3.dynamodb.conditions import Attr, Key


def getDynamoDBTable(tableName):
    return boto3.resource('dynamodb', region_name='us-east-1').Table(tableName)


def readItem(tableName, primaryKeyName, primaryKeyValue):
    table = getDynamoDBTable(tableName)
    response = table.get_item(
        Key={primaryKeyName: primaryKeyValue}
    )
    return response['Item']


def createItem(databaseItem, tableName):
    table = getDynamoDBTable(tableName)
    response = table.put_item(
        Item=databaseItem
    )
    if response["ResponseMetadata"]['HTTPStatusCode'] == 200:
        return True
    else:
        return False


def queryItems(searchKey, searchValue, filterType, tableName):
    table = getDynamoDBTable(tableName)
    if filterType == "eq":
        response = table.scan(FilterExpression=Key(searchKey).eq(searchValue))
    elif filterType == "gt":
        response = table.scan(FilterExpression=Key(searchKey).gt(searchValue))
    elif filterType == "lt":
        response = table.scan(FilterExpression=Key(searchKey).lt(searchValue))
    data = response['Items']
    while 'LastEvaluatedKey' in response:
        response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        data.extend(response['Items'])
    return data


def readAllItems(tableName):
    table = getDynamoDBTable(tableName)
    response = table.scan()
    data = response['Items']
    while 'LastEvaluatedKey' in response:
        response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        data.extend(response['Items'])
    return data


def updateItem(updateKey, updateValue, primaryKeyName, primaryKeyValue, tableName):
    table = getDynamoDBTable(tableName)
    response = table.update_item(
        Key={primaryKeyName: primaryKeyValue},
        UpdateExpression=f"SET #{updateKey}= :newKey",
        ExpressionAttributeValues={
            ':newKey': updateValue
        },
        ExpressionAttributeNames={
            f"#{updateKey}": f"{updateKey}"
        },
        ReturnValues="UPDATED_NEW")
    updateDict = {updateKey: updateValue}
    if response['Attributes'] == updateDict and response["ResponseMetadata"]['HTTPStatusCode'] == 200:
        return True
    else:
        return False


def deleteItem(primaryKeyName, primaryKeyValue, tableName):
    table = getDynamoDBTable(tableName)
    response = table.delete_item(
        Key={primaryKeyName: primaryKeyValue}
    )
    if response["ResponseMetadata"]['HTTPStatusCode'] == 200:
        return True
    else:
        return False
