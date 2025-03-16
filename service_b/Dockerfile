FROM python:3.11-slim

RUN pip install fastapi uvicorn pytest motor pymongo
RUN apt-get update && apt-get install -y socat

COPY main.py /app/main.py
WORKDIR /app
VOLUME ["/tmp"]

CMD ["sh", "-c", "socat TCP-LISTEN:8001,fork UNIX-CONNECT:/tmp/service_b.sock & uvicorn main:app --uds /tmp/service_b.sock"]

