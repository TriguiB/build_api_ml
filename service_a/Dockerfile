FROM python:3.11-slim

RUN pip install fastapi uvicorn httpx pytest motor pymongo
RUN apt-get update && apt-get install -y socat

COPY main.py /app/main.py
COPY test_main.py /app/test_main.py
WORKDIR /app
VOLUME ["/tmp"]

CMD ["sh", "-c", "socat TCP-LISTEN:8000,fork UNIX-CONNECT:/tmp/service_a.sock & uvicorn main:app --uds /tmp/service_a.sock"]

