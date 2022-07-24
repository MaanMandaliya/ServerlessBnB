from dynamodb_connect import connect_to_dynamo
from cognito_signup import add_to_user_pool
import requests
import json
import time


def register(body):

    table = connect_to_dynamo('users')

    # Get the information from the body
    full_name = body['full_name']
    email = body['email']
    password = body['password']
    secret_key = body['secret_key']
    question_1 = body['question_1']
    answer_1 = body['answer_1']
    question_2 = body['question_2']
    answer_2 = body['answer_2']
    question_3 = body['question_3']
    answer_3 = body['answer_3']

    # Store in cognito and get the user_id
    cognito_response_user_id = add_to_user_pool(email, password)
    print('UserID', cognito_response_user_id)

    # Store the user details in dynamodb
    response = table.put_item(Item={
        "full_name": full_name,
        "email": email,
        "password": password,
        "secret_key": secret_key,
        "question_1": question_1,
        "answer_1": answer_1,
        "question_2": question_2,
        "answer_2": answer_2,
        "question_3": question_3,
        "answer_3": answer_3,
        "user_id": cognito_response_user_id,
        "topicName": "pubsub-topic-" + str(cognito_response_user_id)
    })

    # Store the secret key in firestore
    url = "https://firestore.googleapis.com/v1/projects/cipher-356616/databases/(default)/documents/userAuthentication?documentId="+email
    payload = json.dumps({
        "fields": {
            "secretkey": {
                "stringValue": secret_key}}})
    headers = {'Content-Type': 'application/json'}
    response = requests.request("POST", url, headers=headers, data=payload)

    # Event analytics
    print("Tracking event now:")
    url = "https://ac3fx6xfayf3os6luup7weoise0letuf.lambda-url.us-east-1.on.aws/"
    payload = json.dumps({
        "type": "registered",
        "date": time.strftime("%Y-%m-%d")
    })
    headers = {
        'Content-Type': 'application/json'
    }
    response = requests.request("POST", url, headers=headers, data=payload)

    return {"status": "successfully registered"}
