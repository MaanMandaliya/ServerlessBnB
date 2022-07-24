from dynamodb_connect import readItem, readAllItems, updateItem, createItem, deleteItem, queryItems
import uuid
import requests
import json
from decimal import Decimal
import random


def show_tours():
    tours = queryItems("capacity", 0, "gt", "tours")
    return tours


def book_tour(body):
    booking_id = str(uuid.uuid4())
    customer_id = body['username']
    tour_name = body['tour_name']
    tourInfo = queryItems("tour_name", tour_name, "eq", "tours")[0]
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

    if updateStatus:

        # send notification
        customer_id = customer_id.replace("@", "")
        url = "https://us-central1-a2-b00897744.cloudfunctions.net/message-passing/api/pubsub/topic"
        payload = json.dumps({
            "userToken": "pubsub-topic-" + str(customer_id),
            "message": {
                "message": "Your tour has been booked!",
                "category": "tour"
            }
        })
        headers = {
            'Content-Type': 'application/json'
        }
        response = requests.request("POST", url, headers=headers, data=payload)

        # send invoice
        tour_invoice = {"status": "success",
                        "message": "Thank you. You're tour has been booked successfully.",
                        "invoice": f"Invoice: \n Booking ID: {booking_id} \n Tour Name: {tour_name} \n Total Price: {price}"
                        }
    else:
        tour_invoice = {"status": "fail",
                        "message": "Sorry. There was some error. Please try again later. Sorry for the inconvenience."}

    return tour_invoice


def tour_feedback(body):

    feedback_id = str(uuid.uuid4())
    feedback = body['feedback']
    customer_id = body['username']
    tour_name = body['tour_name']
    bookings = queryItems("tour_name", tour_name, "eq", "toursbooking")
    booking = list(
        filter(lambda booking: booking['customer_id'] == customer_id, bookings))
    booking_id = booking[0]['booking_id']

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

    status = createItem(Item, "tourfeedback")
    if status:
        return {"status": "success",
                "message": f"Thank you. You're feedback has been successfully sent."}
    else:
        return {"status": "fail",
                "message": f"Sorry. There was some error in posting you're feedback. Please try again later."}


def recommend_tours(body):
    tour_ids = []
    tours = []
    no_of_days = body['no_of_days']
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
        tours.append(queryItems("tour_id", str(tour_id), "eq", "tours"))
    return tours


def show_all_tour_reviews():
    # Show all reviews
    tour_feedbacks = readAllItems("tourfeedback")
    return {"status": "success", "tour_feedbacks": tour_feedbacks}
