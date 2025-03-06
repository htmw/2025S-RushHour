import os
from pymongo import MongoClient

# Replace with your actual username and password
MONGO_URI = "mongodb+srv://root:loXFr21Z68AxC7Br@medseg.kugvh.mongodb.net/uspark_db?retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)
db = client["uspark_db"]

def save_chat_session(session_id: str, conversation_data: dict):
    db.chatbot.insert_one({"session_id": session_id, **conversation_data})

def save_medseg_result(result_data: dict):
    db.medseg.insert_one(result_data)
