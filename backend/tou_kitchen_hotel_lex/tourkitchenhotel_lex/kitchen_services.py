from dynamodb_utils import readItem, readAllItems, updateItem, createItem, deleteItem, queryItems
from sentiment_analysis import getSentimentScore
from pubsub_utils import send_notification
import uuid


def show_food_menu():
    food_items = queryItems("quantity", 0, "gt", "foodmenu")
    response = "Available Food Options with Price are "
    for food_item in food_items:
        response += f"{food_item['food_name']} = {food_item['price']} CAD,"
    return response


def order_food(body):
    order_id = str(uuid.uuid4())
    customer_id = body['customer_id']
    customer_exist = queryItems("email", customer_id, "eq", "users")
    if not customer_exist:
        return "Your food ordering is not processed. Sorry for the inconvenience. Please check your email."
    food_name = body['food_name']
    quantity = int(body['quantity'])
    room_no = int(body['room_no'])
    room_exist = queryItems("room_no", room_no, "eq", "roomsbooking")
    if not room_exist:
        return "Your food ordering is not processed. Sorry for the inconvenience. Please check your room number."
    foodInfo = queryItems("food_name", food_name, "eq", "foodmenu")
    if not foodInfo:
        return "Your food ordering is not processed. Sorry for the inconvenience. Please check your food name."
    foodInfo = foodInfo[0]
    quantity_exist = foodInfo['quantity']
    if quantity > quantity_exist:
        return f"Your food ordering is not processed. Only {quantity_exist} {food_name} left in kitchen."
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

    # Decrease the food count by ordered quantity
    updateStatus = updateItem(
        "quantity", foodInfo['quantity'] - quantity, "food_id", food_id, "foodmenu")
    if status and updateStatus:
        message = f"Your {quantity} {food_name} has been ordered for {total_price} CAD at {room_no} Room."
        if send_notification(customer_id, "kitchen", message):
            return message
    else:
        return "Your food ordering is not processed. Sorry for the inconvenience."


def food_feedback(body):
    feedback_id = str(uuid.uuid4())
    customer_id = body['customer_id']
    customer_exist = queryItems("email", customer_id, "eq", "users")
    if not customer_exist:
        return "Your room feedback is not posted. Sorry for the inconvenience. Please check your email."
    feedback = body['feedback']
    room_no = int(body['room_no'])
    food_name = body['food_name']
    food_orders = queryItems("room_no", room_no, "eq", "foodorders")
    if not food_orders:
        return "Your food feedback is not posted. Sorry for the inconvenience. Please check your room number."
    print("food_orders: ", food_orders)
    food_order = list(filter(lambda order: order['customer_id'].lower() == customer_id and
                             order['food_name'].lower() == food_name, food_orders))
    if not food_order:
        return "Your food feedback is not posted. Sorry for the inconvenience. Please check your food name or email."
    order_id = food_order[0]['order_id']
    feedbacks_exist = queryItems("order_id", order_id, "eq", "foodfeedback")
    if feedbacks_exist:
        return "You have already posted a food feedback. Thank you and order again."

    Item = {
        "feedback_id": feedback_id,
        "order_id": order_id,
        "feedback": feedback,
        "feedback_score": getSentimentScore(feedback)
    }

    status = createItem(Item, "foodfeedback")

    if status:
        message = f"Your food feedback of {food_order[0]['quantity']} {food_order[0]['food_name']} orderd at room number {room_no} has been posted."
        if send_notification(customer_id, "kitchen", message):
            return message
    else:
        return "Your food feedback is not posted. Sorry for the inconvenience."
