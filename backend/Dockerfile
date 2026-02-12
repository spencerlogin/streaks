FROM python:3.14-alpine

WORKDIR /app

COPY . .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

ENV FLASK_APP=server.py

EXPOSE 5050

CMD ["flask", "run", "--host", "0.0.0.0", "--port", "5050", "--debug"]