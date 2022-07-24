from dynamodb_connect import readItem, readAllItems, updateItem, createItem, deleteItem, queryItems
from boto3.dynamodb.conditions import Key, Attr
import requests
import uuid
import json
from decimal import Decimal
from datetime import date
import random


def show_rooms():
    # Show all rooms with count greater than 0
    rooms = queryItems("room_count", 0, "gt", "rooms")
    return rooms


def get_room_bookings():
    # Show all room bookings
    room_bookings = readAllItems("roomsbooking")
    return {"status": "success", "roombookings": room_bookings}


def book_room(body):
    booking_id = str(uuid.uuid4())
    customer_id = body['username']
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

        # send notification
        customer_id = customer_id.replace("@", "")
        url = "https://us-central1-a2-b00897744.cloudfunctions.net/message-passing/api/pubsub/topic"
        payload = json.dumps({
            "userToken": "pubsub-topic-" + str(customer_id),
            "message": {
                "message": "Your room has been booked!",
                "category": "hotel"
            }
        })
        headers = {
            'Content-Type': 'application/json'
        }
        response = requests.request("POST", url, headers=headers, data=payload)

        # send invoice
        return {"status": "success",
                "message": f"Thank you. Room has been successfully booked.",
                "invoice": f"Invoice: \n Booking ID: {booking_id} \n Room No: {room_no} \n Total Price: {totalprice} "
                }
    else:
        return {"status": "success",
                "message": "Your room booking is not processed. Sorry for the inconvenience."}


def room_feedback(body):
    feedback_id = str(uuid.uuid4())
    customer_id = body['username']
    feedback = body['feedback']
    room_no = int(body['room_no'])
    bookings = queryItems("room_no", room_no, "eq", "roomsbooking")
    booking = list(
        filter(lambda booking: booking['customer_id'] == customer_id, bookings))
    booking_id = booking[0]['booking_id']

    # Calculate the sentiment
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
        return {"status": "success",
                "message": f"Thank you. You're feedback has been successfully sent."}
    else:
        return {"status": "fail",
                "message": f"Sorry. There was some error in posting you're feedback. Please try again later."}


def show_all_room_reviews():
    # Show all reviews
    room_feedbacks = readAllItems("roomfeedback")
    return {"status": "success", "room_feedbacks": room_feedbacks}
