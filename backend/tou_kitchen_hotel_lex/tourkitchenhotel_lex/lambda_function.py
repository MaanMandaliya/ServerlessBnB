from kitchen_services import food_feedback, show_food_menu, order_food
from hotel_services import room_feedback, show_rooms, book_room
from tour_services import show_tours, book_tour, tour_feedback, recommend_tours


def getSlotInterpretedValue(slots, slotName):
    return slots[slotName]['value']['interpretedValue']


def getSlotOriginalValue(slots, slotName):
    return slots[slotName]['value']['originalValue']


def lambda_handler(event, context):

    intent = event['sessionState']['intent']['name']
    slots = event['sessionState']['intent']['slots']
    print("Event: ", event)
    print("Intent: ", intent)
    print("Slots: ", slots)
    body = {}

    try:
        if intent == "RoomAvailability":
            message = show_rooms()

        elif intent == "RoomBooking":
            body['customer_id'] = getSlotOriginalValue(slots, "customer_id")
            body["room_type"] = getSlotOriginalValue(slots, "room_type")
            body["from_date"] = getSlotInterpretedValue(slots, "from_date")
            body["to_date"] = getSlotInterpretedValue(slots, "to_date")
            message = book_room(body)

        elif intent == "RoomFeedback":
            body['customer_id'] = getSlotOriginalValue(slots, "customer_id")
            body["feedback"] = getSlotOriginalValue(slots, "feedback")
            body["room_no"] = getSlotOriginalValue(slots, "room_no")
            message = room_feedback(body)

        elif intent == "TourAvailability":
            message = show_tours()

        elif intent == "TourBooking":
            body['customer_id'] = getSlotOriginalValue(slots, "customer_id")
            body["tour_name"] = getSlotOriginalValue(slots, "tour_name")
            message = book_tour(body)

        elif intent == "TourFeedback":
            body['customer_id'] = getSlotOriginalValue(slots, "customer_id")
            body["feedback"] = getSlotOriginalValue(slots, "feedback")
            body["tour_name"] = getSlotOriginalValue(slots, "tour_name")
            message = tour_feedback(body)

        elif intent == "TourRecommendation":
            body["no_of_days"] = getSlotOriginalValue(slots, "no_of_days")
            message = recommend_tours(body)

        elif intent == "FoodMenu":
            message = show_food_menu()

        elif intent == "FoodOrder":
            body['customer_id'] = getSlotOriginalValue(slots, "customer_id")
            body["food_name"] = getSlotOriginalValue(slots, "food_name")
            body["quantity"] = getSlotOriginalValue(slots, "quantity")
            body["room_no"] = getSlotOriginalValue(slots, "room_no")
            message = order_food(body)

        elif intent == "FoodFeedback":
            body['customer_id'] = getSlotOriginalValue(slots, "customer_id")
            body["feedback"] = getSlotInterpretedValue(slots, "feedback")
            body["room_no"] = getSlotInterpretedValue(slots, "room_no")
            body["food_name"] = getSlotInterpretedValue(slots, "food_name")
            message = food_feedback(body)

        else:
            message = "Something went wrong! Please, try again."

        print("Message: ")
        print(message)

        lexResponse = {
            "messages": [
                {
                    "content": message,
                    "contentType": "PlainText"
                }
            ],
            "sessionState": {
                "dialogAction": {
                    "type": "Close"
                },
                "intent": {
                    "name": intent,
                    "state": "Fulfilled",
                    "confirmationState": "None"
                }
            }
        }
        print("Lex Response: ")
        print(lexResponse)

    except Exception as exception:
        print("Exception occured: ", exception)

    return lexResponse
