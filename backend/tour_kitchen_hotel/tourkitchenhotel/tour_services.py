from dynamodb_connect import connect_to_dynamo
import uuid
import requests
import json
from decimal import Decimal


def show_tours():
    table = connect_to_dynamo('tours')
    tours = table.scan()['Items']
    return tours


def book_tour(body):
    table = connect_to_dynamo('toursbooking')

    booking_id = str(uuid.uuid4())
    customer_id = body['customer_id']
    tour_id = body['tour_id']

    response = table.put_item(Item={
        "booking_id": booking_id,
        "customer_id": customer_id,
        "tour_id": tour_id
    })

    tour_invoice = {"status": "success",
                    "message": "Thank you. You're order will be delivered soon."}

    return tour_invoice


def tour_feedback(body):
    table = connect_to_dynamo('tourfeedback')

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
    return feedback_score
