from fastapi import FastAPI
import httpx

app = FastAPI()
@app.get("/call-service-b")
async def call_service_b():
    # Define the path to the Unix Domain Socket
    uds_path = "/tmp/service_b.sock"
    # Use a custom transport to make requests via the UDS
    transport = httpx.AsyncHTTPTransport(uds=uds_path)
    # Standard URL format without http+unix://
    url = "http://service_b/data"
    async with httpx.AsyncClient(transport=transport) as client:
        response = await client.get(url)
    return response.json()
