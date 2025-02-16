from fastapi import FastAPI, HTTPException
from pymongo import MongoClient

app = FastAPI()

# Configuration MongoDB
MONGO_URI = "mongodb://admin:password@mongo:27017"
client = MongoClient(MONGO_URI)
db = client["mydatabase"]
admin_collection = db["users"]

# Endpoint pour récupérer des données
@app.get("/data")
async def get_data():
    try:
        admins = list(admin_collection.find({}, {"_id": 0}))  # Pas d'_id dans la réponse
        return {"message": "Data retrieved successfully", "data": admins}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint pour mettre à jour des données
@app.put("/data/")
async def update_data(update_filter: dict, new_data: dict):
    try:
        result = admin_collection.update_one(update_filter, {"$set": new_data})
        if result.matched_count > 0:
            return {"message": "Data updated successfully"}
        return {"message": "No matching data found"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
