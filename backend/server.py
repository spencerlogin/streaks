from flask import Flask, request
from flask_cors import CORS
import mysql.connector
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from argon2.profiles import RFC_9106_HIGH_MEMORY
from hashlib import sha256
from uuid import uuid4

app = Flask(__name__)

def get_db_connection():
    return  mysql.connector.connect(user='spencer', password='password', host='mysql', database='streaks')

CORS(app, resources=r'/api/*', allow_headers=['Content-Type'], supports_credentials=True)

@app.route('/api/hello', methods=['GET'])
def hello_world():
    return {'res': 'Hello, World!'}

@app.route('/api/login', methods=['GET', 'POST'])
def login_user():
    username = request.form['username']
    password = request.form['password']

    # get hash of user's password from db
    cnx = get_db_connection()
    cursor = cnx.cursor()
    query = (
        "SELECT username, email, firstName, lastName, password FROM users WHERE username=%s OR email=%s"
    )
    data = (username, username)
    cursor.execute(query, data)
    try:
        username, email, firstName, lastName, pwHash = cursor.fetchone()
    except Exception:
        cursor.close()
        cnx.close()
        return {'message': 'Invalid username or password'}, 400
 
    # verify that the user even exists
    if pwHash:
        # verify hash from db against user-supplied pw
        ph = PasswordHasher.from_parameters(RFC_9106_HIGH_MEMORY)
        try:
            ph.verify(pwHash, password)
            # generate session token
            token = sha256(str(uuid4()).encode('utf-8')).hexdigest()
            # add token to db
            query = (
                "UPDATE users SET token=%s WHERE username=%s OR email=%s"
            )
            data = (token, username, username)
            cursor.execute(query, data)
            cnx.commit()
            cursor.close()
            cnx.close()
            return ({'username': username, 'email': email, 'firstName': firstName, 'lastName': lastName}, 200, {'Set-Cookie': f'token={token}; SameSite=Strict; Max-Age=604800; HttpOnly'})
        except VerifyMismatchError:
            cursor.close()
            cnx.close()
            return {'message': 'Incorrect username/email or password'}, 401

    else:
        cursor.close()
        cnx.close()
        return {'message': 'Invalid username or password'}, 400
