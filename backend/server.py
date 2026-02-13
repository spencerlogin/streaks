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

@app.route('/api/signup', methods=['GET', 'POST'])
def signup_user():
    email = request.form['email']
    username = request.form['username']
    firstName = request.form['firstName']
    lastName = request.form['lastName']
    password = request.form['password']
    
    # check that username and email are free
    cnx = get_db_connection()
    cursor = cnx.cursor()
    query = (
        "SELECT username, email FROM users WHERE username=%s OR email=%s"
    )
    data = (username, email)
    userTaken, emailTaken = False, False
    # TODO: Fix this, users are able to sign up with other users' emails and usernames
    try:
        for takenUsername, takenEmail in cursor:
            if username == takenUsername:
                userTaken = True
            if email == takenEmail:
                emailTaken = True
    except Exception:
        # no cursor meaning neither email nor username was taken
        pass

    # return error if username or email is taken with appropriate error messages
    if userTaken or emailTaken:
        cursor.close()
        cnx.close()
        if userTaken and emailTaken:
            return {'message': 'Username and email taken'}, 400
        elif userTaken:
            return {'message': 'Username taken'}, 400
        elif emailTaken:
            return {'message': 'Email taken'}, 400
    # insert user into db and generate token
    else:
        ph = PasswordHasher.from_parameters(RFC_9106_HIGH_MEMORY) 
        pwHash = ph.hash(password)
        token = sha256(str(uuid4()).encode('utf-8')).hexdigest()
        query = (
            "INSERT INTO users (firstName, lastName, email, username, password, token)"
            "VALUES (%s, %s, %s, %s, %s, %s)"
        )
        data = (firstName, lastName, email, username, pwHash, token)
        cursor.execute(query, data)
        cnx.commit()
        cursor.close()
        cnx.close()
        return ({'message': 'Success!'}, 200, {'Set-Cookie': f'token={token}; SameSite=Strict; Max-Age=604800; HttpOnly'})

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
