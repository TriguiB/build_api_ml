from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
from pydantic import BaseModel

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
admin_collection = db["users"]

@app.get("/data")
async def get_users():
    try:
        users = list(admin_collection.find({}, {"_id": 1, "name": 1, "email": 1}))  
        for user in users:
            user["_id"] = str(user["_id"])
        return {"message": "Data retrieved successfully", "data": users}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class UpdateUserModel(BaseModel):
    update_filter: dict
    new_data: dict

@app.put("/data/")
async def update_data(update_request: UpdateUserModel):
    try:
        update_filter = update_request.update_filter
        new_data = update_request.new_data

        if "_id" not in update_filter:
            raise HTTPException(status_code=400, detail="Missing _id field in update_filter")

        user_id = update_filter["_id"]
        if not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId format")

        result = admin_collection.update_one({"_id": ObjectId(user_id)}, {"$set": new_data})

        if result.matched_count > 0:
            return {"message": "User updated successfully"}
        return {"message": "No matching user found"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
