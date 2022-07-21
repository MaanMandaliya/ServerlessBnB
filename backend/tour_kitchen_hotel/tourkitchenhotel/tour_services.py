from dynamodb_connect import readItem, readAllItems, updateItem, createItem, deleteItem, queryItems
import uuid
import requests
import json
from decimal import Decimal


def show_tours():
    tours = queryItems("capacity", 0, "gt", "tours")
    return tours


def book_tour(body):
    booking_id = str(uuid.uuid4())
    customer_id = "Random123"  # update it with actual id
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
        "price": price
    }
    status = createItem(Item, "toursbooking")

    # Decrease the tour capacity by 1
    updateStatus = updateItem(
        "capacity", tourInfo['capacity'] - 1, "tour_id", tour_id, "tours")

    if updateStatus:
        tour_invoice = {"status": "success",
                        "message": "Thank you. You're tour has been booked successfully.",
                        "invoice": f"Invoice: \n Booking ID: {booking_id} \n Tour ID: {tour_id} \n Total Price: {price}"
                        }
    else:
        tour_invoice = {"status": "fail",
                        "message": "Sorry. There was some error. Please try again later. Sorry for the inconvenience."}

    return tour_invoice


def tour_feedback(body):

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

    status = createItem(Item, "tourfeedback")
    if status:
        return {"status": "success",
                "message": f"Thank you. You're feedback has been successfully sent."}
    else:
        return {"status": "fail",
                "message": f"Sorry. There was some error in posting you're feedback. Please try again later."}
