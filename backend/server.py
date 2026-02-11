from flask import Flask, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)

def get_db_connection():
    return  mysql.connector.connect(user='spencer', password='password', host='mysql', database='streaks')

CORS(app)

count = 0

@app.route("/api/hello")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/api/incrementCount")
def incrementCount():
    global count
    count += 1
    return {'count': count}, 200

@app.route("/api/getCount")
def getCount():
    global count
    return {'count': count}, 200

@app.route("/api/getUsers")
def getUsers():
    cnx = get_db_connection()
    cursor = cnx.cursor()
    query = 'SELECT username FROM users'
    result = []
    cursor.execute(query)
    for username in cursor:
        result.append(username)
    cursor.close()
    cnx.close()
    print(result)
    return result
