from dynamodb_connect import readItem, readAllItems, updateItem, createItem, deleteItem, queryItems
from boto3.dynamodb.conditions import Key, Attr
import requests
import uuid
import json
from decimal import Decimal
from datetime import date
import random


def show_rooms():
    rooms = queryItems("room_count", 0, "gt", "rooms")
    return rooms


def book_room(body):
    booking_id = str(uuid.uuid4())
    customer_id = "Random123"
    roomType = body['room_type']
    from_date = body['from_date']
    from_date_ls = list(map(lambda x: int(x), from_date.split("-")))
    from_date_obj = date(from_date_ls[0], from_date_ls[1], from_date_ls[2])
    to_date = body['to_date']
    to_date_ls = list(map(lambda x: int(x), to_date.split("-")))
    to_date_obj = date(to_date_ls[0], to_date_ls[1], to_date_ls[2])
    room_no = random.randint(101, 999)
    roomInfo = queryItems("room_type", roomType, "eq", "rooms")[0]
    price = roomInfo['price']
    room_id = roomInfo['room_id']
    totalprice = price * (to_date_obj - from_date_obj).days

    Item = {
        "booking_id": booking_id,
        "customer_id": customer_id,
        "room_id": room_id,
        "from_date": from_date,
        "to_date": to_date,
        "room_no": room_no,
        "totalprice": totalprice
    }
    status = createItem(Item, "roomsbooking")

    # Decrease the room count by 1
    updateStatus = updateItem(
        "room_count", roomInfo['room_count'] - 1, "room_id", room_id, "rooms")

    if status and updateStatus:
        return {"status": "success",
                "message": "Thank you. Room has been successfully booked."}
    else:
        return {"status": "success",
                "message": "Your room booking is not processed. Sorry for the inconvenience."}


def room_feedback(body):
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
    headers = {'Content-Type': 'application/json'}
    response = requests.request("POST", url, headers=headers, data=payload)

    sentiment_analysis_response = json.loads(
        response.text, parse_float=Decimal)
    feedback_score = sentiment_analysis_response["sentences"][0]["sentiment"]["score"]

    Item = {
        "feedback_id": feedback_id,
        "booking_id": booking_id,
        "feedback": feedback,
        "feedback_score": feedback_score
    }
    status = createItem(Item, "roomfeedback")

    if status:
        return f"Your hotel room feedback has been posted."
    else:
        return "Your hotel room feedback is not posted. Sorry for the inconvenience."
