from datetime import date
from dynamodb_utils import readItem, readAllItems, updateItem, createItem, deleteItem, queryItems
from sentiment_analysis import getSentimentScore
from pubsub_utils import send_notification
import uuid
import random


def show_rooms():
    rooms = queryItems("room_count", 0, "gt", "rooms")
    response = "Available Rooms with Price/night are "
    for room in rooms:
        response += f"{room['room_type']} = {room['price']} CAD,"
    return response


def book_room(body):
    booking_id = str(uuid.uuid4())
    customer_id = body['customer_id']
    customer_exist = queryItems("email", customer_id, "eq", "users")
    if not customer_exist:
        return "Your room booking is not processed. Sorry for the inconvenience. Please check your email."
    roomType = body['room_type']
    from_date = body['from_date']
    from_date_ls = list(map(lambda x: int(x), from_date.split("-")))
    from_date_obj = date(from_date_ls[0], from_date_ls[1], from_date_ls[2])
    to_date = body['to_date']
    to_date_ls = list(map(lambda x: int(x), to_date.split("-")))
    to_date_obj = date(to_date_ls[0], to_date_ls[1], to_date_ls[2])
    if to_date_obj < from_date_obj:
        return "Your room booking is not processed. Sorry for the inconvenience. Please check your dates."
    room_no = random.randint(101, 999)
    roomInfo = queryItems("room_type", roomType, "eq", "rooms")
    if not roomInfo:
        return "Your room booking is not processed. Sorry for the inconvenience. Please check your room number."
    roomInfo = roomInfo[0]
    room_count = roomInfo['room_count']
    if room_count <= 0:
        return "Your room booking is not processed. Room is not available now."
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
        message = f"Your {roomType} Room with room number {room_no} has been booked from {from_date} to {to_date} for {totalprice} CAD."
        if send_notification(customer_id, "hotel", message):
            return message
    else:
        return "Your room booking is not processed. Sorry for the inconvenience."


def room_feedback(body):
    feedback_id = str(uuid.uuid4())
    customer_id = body['customer_id']
    customer_exist = queryItems("email", customer_id, "eq", "users")
    if not customer_exist:
        return "Your room feedback is not posted. Sorry for the inconvenience. Please check your email."
    feedback = body['feedback']
    room_no = int(body['room_no'])
    bookings = queryItems("room_no", room_no, "eq", "roomsbooking")
    print("bookings: ", bookings)
    if not bookings:
        return "Your room feedback is not posted. Sorry for the inconvenience. Please check your room number."
    booking = list(
        filter(lambda booking: booking['customer_id'].lower() == customer_id, bookings))
    print("booking: ", booking)
    if not booking:
        return "Your room feedback is not posted. Sorry for the inconvenience. Please check your email."
    # to_date = bookingInfo[0]['to_date']
    # to_date_ls = list(map(lambda x: int(x), to_date.split("-")))
    # to_date_obj = date(to_date_ls[0], to_date_ls[1], to_date_ls[2])
    # today = date.today()
    # if today <= to_date_obj:
    #     return "You can not post feedback before end of room booking. Sorry for the inconvenience."
    booking_id = booking[0]['booking_id']
    feedbacks_exist = queryItems(
        "booking_id", booking_id, "eq", "roomfeedback")
    if feedbacks_exist:
        return "You have already posted a room feedback. Thank you and come again."

    Item = {
        "feedback_id": feedback_id,
        "booking_id": booking_id,
        "feedback": feedback,
        "feedback_score": getSentimentScore(feedback)
    }
    status = createItem(Item, "roomfeedback")

    if status:
        message = f"Your hotel room feedback of room number {bookings[0]['room_no']} from {bookings[0]['from_date']} to {bookings[0]['to_date']} has been posted."
        if send_notification(customer_id, "hotel", message):
            return message
    else:
        return "Your hotel room feedback is not posted. Sorry for the inconvenience."
