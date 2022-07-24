import requests
import json

def send_notification(username, category, message):
  username = username.replace("@","")
  url = "https://us-central1-a2-b00897744.cloudfunctions.net/message-passing/api/pubsub/topic"
  payload = json.dumps({
    "userToken": f"pubsub-topic-{username}",
    "message": {
        "message": message,
        "category": category
    }
  })
  headers = {
    'Content-Type': 'application/json'
  }
  response = requests.request("POST", url, headers=headers, data=payload)
  return response.status_code == 200