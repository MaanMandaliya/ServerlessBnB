from dynamodb_connect import connect_to_dynamo
from boto3.dynamodb.conditions import Key, Attr
import requests
import uuid
import json
from decimal import Decimal


def show_rooms():
    table = connect_to_dynamo('rooms')
    rooms = table.scan(
        FilterExpression=Attr('is_available').eq(True)
    )
    return rooms['Items']


def book_room(body):
    table = connect_to_dynamo('roomsbooking')

    booking_id = str(uuid.uuid4())
    customer_id = body['customer_id']
    room_id = body['room_id']
    from_date = body['from_date']
    to_date = body['to_date']

    response = table.put_item(Item={
        "booking_id": booking_id,
        "customer_id": customer_id,
        "room_id": room_id,
        "from_date": from_date,
        "to_date": to_date
    })

    room_invoice = {"status": "success",
                    "message": "Thank you. Room has been successfully booked."}

    return response


def room_feedback(body):
    table = connect_to_dynamo('roomfeedback')

    feedback_id = str(uuid.uuid4())
    feedback = body['feedback']
    booking_id = body['booking_id']

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
        "booking_id": booking_id,
        "feedback_score": feedback_score
    })
    return response
