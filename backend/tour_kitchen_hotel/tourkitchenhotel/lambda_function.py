import json
from kitchen_services import show_food_menu, order_food, food_feedback, get_food_orders, show_all_food_reviews
from hotel_services import show_rooms, book_room, room_feedback, get_room_bookings, show_all_room_reviews
from tour_services import show_tours, book_tour, tour_feedback, recommend_tours, show_all_tour_reviews


def lambda_handler(event, context):

    http_method = event['requestContext']['http']['method']
    path = event['requestContext']['http']['path']

    if 'body' in event:
        body = json.loads(event['body'])

    # Hotel services
    if path == "/showrooms":
        rooms = show_rooms()
        return rooms
    elif path == "/roombookings":
        room_bookings = get_room_bookings()
        return room_bookings
    elif path == "/bookroom":
        room_invoice = book_room(body)
        return room_invoice
    elif path == "/roomfeedback":
        response = room_feedback(body)
        return response
    elif path == "/roomfeedbacks":
        room_feedbacks = show_all_room_reviews()
        return room_feedbacks

    # Tour services
    elif path == "/showtours":
        tours = show_tours()
        return tours
    elif path == "/booktour":
        tour_invoice = book_tour(body)
        return tour_invoice
    elif path == "/tourfeedback":
        response = tour_feedback(body)
        return response
    elif path == "/recommendtours":
        response = recommend_tours(body)
        return response
    elif path == "/tourfeedbacks":
        tour_feedbacks = show_all_tour_reviews()
        return tour_feedbacks

    # Food services
    elif path == "/showfoodmenu":
        menu = show_food_menu()
        return menu
    elif path == "/foodorders":
        foodorders = get_food_orders()
        return foodorders
    elif path == "/orderfood":
        food_invoice = order_food(body)
        return food_invoice
    elif path == "/foodfeedback":
        response = food_feedback(body)
        return response
    elif path == "/foodfeedbacks":
        food_feedbacks = show_all_food_reviews()
        return food_feedbacks

    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
