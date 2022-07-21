import json
from kitchen_services import show_food_menu, order_food, food_feedback
from hotel_services import show_rooms, book_room, room_feedback
from tour_services import show_tours, book_tour, tour_feedback


def lambda_handler(event, context):

    http_method = event['requestContext']['http']['method']
    path = event['requestContext']['http']['path']

    if 'body' in event:
        body = json.loads(event['body'])

    if path == "/showrooms":
        rooms = show_rooms()
        return rooms
    elif path == "/bookroom":
        room_invoice = book_room(body)
        return room_invoice
    elif path == "/roomfeedback":
        response = room_feedback(body)
        return response

    elif path == "/showtours":
        tours = show_tours()
        return tours
    elif path == "/booktour":
        tour_invoice = book_tour(body)
        return tour_invoice
    elif path == "/tourfeedback":
        response = tour_feedback(body)
        return response

    elif path == "/showfoodmenu":
        menu = show_food_menu()
        return menu
    elif path == "/orderfood":
        food_invoice = order_food(body)
        return food_invoice
    elif path == "/foodfeedback":
        response = food_feedback(body)
        return response

    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
