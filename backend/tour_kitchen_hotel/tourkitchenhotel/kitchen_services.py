from dynamodb_connect import readItem, readAllItems, updateItem, createItem, deleteItem, queryItems
import uuid
import requests
import json
from decimal import Decimal


def show_food_menu():
    food_items = queryItems("quantity", 0, "gt", "foodmenu")
    return food_items


def order_food(body):
    order_id = str(uuid.uuid4())
    customer_id = "Random123"  # update it with actual id
    food_name = body['food_name']
    quantity = body['quantity']
    room_no = body['room_no']
    foodInfo = queryItems("food_name", food_name, "eq", "foodmenu")[0]
    food_id = foodInfo['food_id']
    total_price = foodInfo['price'] * quantity

    Item = {
        "order_id": order_id,
        "food_id": food_id,
        "customer_id": customer_id,
        "room_no": room_no,
        "food_name": food_name,
        "quantity": quantity,
        "total_price": total_price
    }

    status = createItem(Item, "foodorders")

    # Decrease the food count by quantity
    updateStatus = updateItem(
        "quantity", foodInfo['quantity'] - quantity, "food_id", food_id, "foodmenu")

    if updateStatus:
        food_invoice = {"status": "success",
                        "message": "Thank you. You're order will be delivered soon."}
    else:
        food_invoice = {"status": "fail",
                        "message": "Sorry. There was some problem. Please try again later."}

    return food_invoice


def food_feedback(body):
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
    headers = {'Content-Type': 'application/json'}
    response = requests.request("POST", url, headers=headers, data=payload)

    sentiment_analysis_response = json.loads(
        response.text, parse_float=Decimal)
    feedback_score = sentiment_analysis_response["sentences"][0]["sentiment"]["score"]

    Item = {
        "feedback_id": feedback_id,
        "order_id": order_id,
        "feedback": feedback,
        "feedback_score": feedback_score
    }

    status = createItem(Item, "foodfeedback")
    if status:
        return f"Your food feedback has been posted."
    else:
        return "Your food feedback is not posted. Sorry for the inconvenience."
