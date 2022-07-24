from dynamodb_connect import readItem, readAllItems, updateItem, createItem, deleteItem, queryItems
import uuid
import requests
import json
from decimal import Decimal


def show_food_menu():
    # Show all food items which are available
    food_items = queryItems("quantity", 0, "gt", "foodmenu")
    return food_items


def get_food_orders():
    # Show all food orders
    food_orders = readAllItems("foodorders")
    return {"status": "success", "foodorders": food_orders}


def order_food(body):
    order_id = str(uuid.uuid4())
    customer_id = body['username']
    food_name = body['food_name']
    quantity = int(body['quantity'])
    room_no = int(body['room_no'])
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

        # Send notification
        customer_id = customer_id.replace("@", "")
        url = "https://us-central1-a2-b00897744.cloudfunctions.net/message-passing/api/pubsub/topic"
        payload = json.dumps({
            "userToken": "pubsub-topic-" + str(customer_id),
            "message": {
                "message": "Your food order has been placed!",
                "category": "kitchen"
            }
        })
        headers = {
            'Content-Type': 'application/json'
        }
        response = requests.request("POST", url, headers=headers, data=payload)

        # # Event analytics
        # print("Tracking event now:")
        # url = "https://wuy3jsfi3rm7f4ac7bg7rrz72i0bwohj.lambda-url.us-east-1.on.aws/"
        # payload = json.dumps({
        #   "order_id": "registered",
        #   "date": time.strftime("%Y-%m-%d"),
        #   "food_name": ,
        #   "qty": ,
        #   "price":
        # })
        # headers = {
        #   'Content-Type': 'application/json'
        # }
        # response = requests.request("POST", url, headers=headers, data=payload)
        # print("Response", response)

        # Send invoice
        food_invoice = {"status": "success",
                        "message": "Thank you. You're order will be delivered soon.",
                        "invoice": f"Invoice: \n Order ID: {order_id} \n Room No: {room_no} \n Total Price: {total_price}"
                        }
    else:
        food_invoice = {"status": "fail",
                        "message": "Sorry. There was some problem. Please try again later."}
    return food_invoice


def food_feedback(body):
    feedback_id = str(uuid.uuid4())
    customer_id = body['username']
    feedback = body['feedback']
    room_no = int(body['room_no'])
    food_name = body['food_name']
    food_orders = queryItems("room_no", room_no, "eq", "foodorders")
    print(food_orders)
    food_order = list(filter(lambda order: order['customer_id'] == customer_id and
                             order['food_name'] == food_name, food_orders))
    print(food_order)
    order_id = food_order[0]['order_id']

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
        return {"status": "success",
                "message": f"Thank you. You're feedback has been successfully sent."}
    else:
        return {"status": "fail",
                "message": f"Sorry. There was some error in posting you're feedback. Please try again later."}


def show_all_food_reviews():
    # Show all reviews
    food_feedbacks = readAllItems("foodfeedback")
    return {"status": "success", "food_feedbacks": food_feedbacks}
