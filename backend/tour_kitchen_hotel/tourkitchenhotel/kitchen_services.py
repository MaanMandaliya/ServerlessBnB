from dynamodb_connect import connect_to_dynamo
import uuid
import requests
import json
from decimal import Decimal


def show_food_menu():
    table = connect_to_dynamo('foodmenu')
    food_items = table.scan()['Items']
    return food_items


def order_food(body):
    table = connect_to_dynamo('foodorders')

    order_id = str(uuid.uuid4())
    customer_id = body['customer_id']
    food_id = body['food_id']

    response = table.put_item(Item={
        "order_id": order_id,
        "customer_id": customer_id,
        "food_id": food_id
    })

    food_invoice = {"status": "success",
                    "message": "Thank you. You're order will be delivered soon."}

    return food_invoice


def food_feedback(body):
    table = connect_to_dynamo('foodfeedback')

    feedback_id = str(uuid.uuid4())
    feedback = body['feedback']
    order_id = body['order_id']
    url = "https://language.googleapis.com/v1/documents:analyzeSentiment?key=AIzaSyDVnYWMXz1cDr4j-3jinkQn_F-60AkCyp0"

    payload = json.dumps({
        "document": {
            "type": "PLAIN_TEXT",
            "content": feedback
        },
        "encodingType": "UTF8"
    })
    headers = {
        'Content-Type': 'application/json'
    }
    response = requests.request("POST", url, headers=headers, data=payload)

    sentiment_analysis_response = json.loads(
        response.text, parse_float=Decimal)
    feedback_score = sentiment_analysis_response["sentences"][0]["sentiment"]["score"]

    response = table.put_item(Item={
        "feedback_id": feedback_id,
        "feedback": feedback,
        "order_id": order_id,
        "feedback_score": feedback_score
    })
    return response
