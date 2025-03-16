from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = "mongodb://admin:password@mongo:27017"
client = MongoClient(MONGO_URI)
db = client["mydatabase"]
user_collection = db["users"]

@app.post("/user/")
async def create_user(user: dict):
    try:
        result = user_collection.insert_one(user)
        return {"message": "User created successfully", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
