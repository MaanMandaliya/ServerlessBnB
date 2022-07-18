from dynamodb_connect import connect_to_dynamo
from cognito_signup import add_to_user_pool
import requests
import json
from googleapiclient.discovery import build
from google.oauth2 import service_account


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
    url = "https://firestore.googleapis.com/v1/projects/usermanagement-356401/databases/(default)/documents/userAuthentication?documentId="+email

    payload = json.dumps({
        "fields": {
            "secretkey": {
                "stringValue": secret_key}}})
    headers = {
        'Content-Type': 'application/json'
    }
    response = requests.request("POST", url, headers=headers, data=payload)

    # Dont consider from here A
    # url = "localhost/api/pubsub"
    # payload = json.dumps({
    #  "userId": cognito_response_user_id
    # })
    # headers = {
    #  'Content-Type': 'application/json'
    # }
    # response = requests.request("POST", url, headers=headers, data=payload)
    # A ends here

    # Event Analytics
    # SERVICE_ACCOUNT_FILE = 'gckey.json'
    # SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
    # creds = None
    # creds = service_account.Credentials.from_service_account_file(
    #     SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    # SAMPLE_SPREADSHEET_ID = '1qQ7WrQTKC81QWAp81twy3RWqRx-Kzzjb2KclT-gh9N4'
    # service = build('sheets', 'v4', credentials=creds)
    # sheet = service.spreadsheets()
    # sheet.values().append(spreadsheetId=SAMPLE_SPREADSHEET_ID,
    #                       range="Sheet1!A:Z", valueInputOption="USER_ENTERED",
    #                             insertDataOption="INSERT_ROWS", body={"values": [["registered", 1]]}).execute()

    return {"status": "successfully registered"}
