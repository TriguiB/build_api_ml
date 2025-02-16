from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
import httpx

app = FastAPI()

# Configuration MongoDB
MONGO_URI = "mongodb://admin:password@mongo:27017"
client = MongoClient(MONGO_URI)
db = client["mydatabase"]
user_collection = db["users"]

# Endpoint pour insérer des données utilisateur
@app.post("/user/")
async def create_user(user: dict):
    try:
        result = user_collection.insert_one(user)
        return {"message": "User created successfully", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint pour appeler Service B
@app.get("/call-service-b")
async def call_service_b():
    uds_path = "/tmp/service_b.sock"
    url = "http://service_b/data"  # Requête via le Unix Domain Socket
    transport = httpx.AsyncHTTPTransport(uds=uds_path)
    async with httpx.AsyncClient(transport=transport) as client:
        try:
            response = await client.get(url)
            return response.json()
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=str(e))
