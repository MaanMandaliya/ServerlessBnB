from dynamodb_utils import readItem, readAllItems, updateItem, createItem, deleteItem, queryItems
from sentiment_analysis import getSentimentScore
from pubsub_utils import send_notification
import uuid
import random
import json
import requests


def show_tours():
    tours = queryItems("capacity", 0, "gt", "tours")
    response = "Available Tours with Dates and Price are "
    for tour in tours:
        response += f"{tour['tour_name']} from {tour['from_date']} to {tour['to_date']} worth {tour['price']} CAD,"
    return response


def book_tour(body):
    booking_id = str(uuid.uuid4())
    customer_id = body['customer_id']
    customer_exist = queryItems("email", customer_id, "eq", "users")
    if not customer_exist:
        return "Your tour booking is not processed. Sorry for the inconvenience. Please check your email."
    tour_name = body['tour_name']
    tourInfo = queryItems("tour_name", tour_name, "eq", "tours")
    if not tourInfo:
        return "Your tour booking is not processed. Sorry for the inconvenience. Please check your tour name."
    tourInfo = tourInfo[0]
    capacity = tourInfo['capacity']
    if capacity <= 0:
        return "Your tour booking is not processed. Tour capacity is reached to its limit."
    tour_id = tourInfo['tour_id']
    price = tourInfo['price']
    to_date = tourInfo['to_date']
    from_date = tourInfo['from_date']

    Item = {
        "booking_id": booking_id,
        "customer_id": customer_id,
        "tour_id": tour_id,
        "tour_name": tour_name,
        "price": price
    }
    status = createItem(Item, "toursbooking")

    # Decrease the tour capacity by 1
    updateStatus = updateItem(
        "capacity", tourInfo['capacity'] - 1, "tour_id", tour_id, "tours")
    if status and updateStatus:
        message = f"Your {tour_name} Tour has been booked from {from_date} to {to_date} for {price} CAD."
        if send_notification(customer_id, "tour", message):
            return message
    else:
        return "Your tour booking is not processed. Sorry for the inconvenience."


def tour_feedback(body):
    feedback_id = str(uuid.uuid4())
    customer_id = body['customer_id']
    customer_exist = queryItems("email", customer_id, "eq", "users")
    if not customer_exist:
        return "Your tour feedback is not posted. Sorry for the inconvenience. Please check your email."
    feedback = body['feedback']
    tour_name = body['tour_name']
    bookings = queryItems("tour_name", tour_name, "eq", "toursbooking")
    if not bookings:
        return "Your tour feedback is not posted. Sorry for the inconvenience. Please check your tour name."
    booking = list(
        filter(lambda booking: booking['customer_id'].lower() == customer_id, bookings))
    if not booking:
        return "Your tour feedback is not posted. Sorry for the inconvenience. Please check your email."
    # bookingInfo = queryItems("tour_name", tour_name, "eq", "tours")
    # to_date = bookingInfo[0]['to_date']
    # to_date_ls = list(map(lambda x: int(x), to_date.split("-")))
    # to_date_obj = date(to_date_ls[0], to_date_ls[1], to_date_ls[2])
    # today = date.today()
    # if today <= to_date_obj:
    #     return "You can not post feedback before end of tour. Sorry for the inconvenience."
    booking_id = booking[0]['booking_id']
    feedbacks_exist = queryItems(
        "booking_id", booking_id, "eq", "tourfeedback")
    if feedbacks_exist:
        return "You have already posted a tour feedback. Thank you and come again."

    Item = {
        "feedback_id": feedback_id,
        "booking_id": booking_id,
        "feedback": feedback,
        "feedback_score": getSentimentScore(feedback)
    }

    status = createItem(Item, "tourfeedback")

    if status:
        message = f"Your tour feedback of {bookings[0]['tour_name']} has been posted."
        if send_notification(customer_id, "tour", message):
            return message
    else:
        return "Your tour feedback is not posted. Sorry for the inconvenience."


def recommend_tours(body):
    tour_ids = []
    tours = []
    no_of_days = int(body['no_of_days'])
    index = random.randint(1, 999)

    url = "https://us-central1-assignment4-5410serverless-sid.cloudfunctions.net/tour_recommendation"
    payload = json.dumps({
        "index": str(index),
        "days": str(no_of_days)
    })
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjYzMWZhZTliNTk0MGEyZDFmYmZmYjAwNDAzZDRjZjgwYTIxYmUwNGUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA4MzUzODg5NjI1MTY4NzM5OTM4IiwiZW1haWwiOiJtYWhhbnRzaWRoYXJ0aEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IlIwUHNSSW1uc2JBbXE0Sl8tQmdSQ3ciLCJpYXQiOjE2NTg0MTQ0OTgsImV4cCI6MTY1ODQxODA5OCwianRpIjoiOTA1MDk3MGUzZTJkZDMyMmQ5YWQwMGQ4OGI1OGMyMjQ3ZGQxYzM4ZCJ9.Bb1a9yM3hrga3S-7umcIh0xTMzTX4Pls_WXiSIrmqEdv6UThwbf9YPlVq5a7nO1uLtGtw_4F0XftXLKSpAjNgCPf35snWEdCauK4vl9xywCaD_PazbHxbj4zGDfeyGPbz3EE-J9_vCbGT3UVFVuQRKfWhOpNgr2-1fegAGrn6F42hK31hecaV8InND5j06b5GElzIvUY99TtLQWEgK2mkxu28s53YcKOnaAmANrrsxzqCds3a1pm5CNJy-SyWeB7XDX49sE3zT1Cl9wRe_j6x8-VnJFGOTck91eoE6uTnUfWEdH3NXOTrjXsKRNydlhUc8dowmJv7e5GMwl-UVbP0Q'
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    dict_tours = json.loads(response.text)

    recommended_tours = sorted(
        dict_tours.items(), key=lambda x: x[1], reverse=True)
    for tour in recommended_tours:
        tour_ids.append(tour[0])

    for tour_id in tour_ids:
        tours.append(queryItems("tour_id", str(tour_id), "eq", "tours")[0])

    response = "Recommended Tours with Dates and Price are "
    for tour in tours:
        response += f"{tour['tour_name']} from {tour['from_date']} to {tour['to_date']} worth {tour['price']} CAD,"
    return response
