import boto3
from boto3.dynamodb.conditions import Attr, Key

aws_access_key_id = "ASIAY3TBENAPD6MOOUP6"
aws_secret_access_key = "m88M7YlIn+wHp07U9CcFtC1t6THLFEZXrF9wEXdy"
aws_session_token = "FwoGZXIvYXdzEFsaDObSfpsyy8i7Nsz7QyLAAW7KtfJtJhb1o5qxyUNkKdA07OUuXKQzxTc2Bp2yE2bJz8GuK5rRkXc5xUnfK0K/zvivg54JezvyUHYzdjcYCFQoWrG6qzSfydfq6H9bsrnOdGEwhluByx9NagG6sXR0pIWwFwwdVH8nYGCygj5hBohOSgkFJZCd8dfYM/yCeBfu8qtyZ3F+IAroae+BLB2hADuR+XiHbX4VjMmxT5PXiwsTPF92i1j2cC25VcSMmosYOzSD/jL238Sj05tvRI62zyiSgPaWBjItY+un3faSq+TGL2M45FlTSCy64OocSWZUwsNR8babG5PTBJkdfAMPjaLfP4/a"


def getDynamoDBTable(tableName):
    session = boto3.Session(aws_access_key_id=aws_access_key_id,
                            aws_secret_access_key=aws_secret_access_key, aws_session_token=aws_session_token)
    return session.resource('dynamodb', region_name='us-east-1').Table(tableName)


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
