from flask import Flask, request
from flask_cors import CORS
import mysql.connector
from mysql.connector.errors import IntegrityError
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from argon2.profiles import RFC_9106_HIGH_MEMORY
from hashlib import sha256
from uuid import uuid4
from datetime import date
from dotenv import dotenv_values

config = dotenv_values(".env")

app = Flask(__name__)

def get_db_connection():
    return  mysql.connector.connect(user='root', password=config['SQL_ROOT_PW'], host='mysql', database='streaks')

CORS(app, resources=r'/api/*', allow_headers=['Content-Type'], supports_credentials=True)

@app.route('/api/hello', methods=['GET'])
def hello_world():
    return {'res': 'Hello, World!'}

@app.route('/api/loggedIn', methods=['GET'])
def checkLoggedIn():
    try:
        token = request.cookies['token']
        cnx = get_db_connection()
        cursor = cnx.cursor()
        query = (
            'SELECT email, username, firstName, lastName FROM users WHERE token=%s'
        )
        data = [token]
        cursor.execute(query, data)
        try:
            email, username, firstName, lastName = cursor.fetchone()
        except Exception:
            return {'message': 'Token invalid'}, 400
        return {'message': 'User logged in', 'email': email, 'username': username, 'firstName': firstName, 'lastName': lastName}, 200
    except KeyError:
        return {'message': 'User not logged in'}, 401

 
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
        'SELECT username, email FROM users WHERE username=%s OR email=%s'
    )
    data = (username, email)
    cursor.execute(query, data)
    userTaken, emailTaken = False, False
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
            'INSERT INTO users (firstName, lastName, email, username, password, token)'
            'VALUES (%s, %s, %s, %s, %s, %s)'
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
        'SELECT username, email, firstname, lastname, password FROM users WHERE username=%s OR email=%s'
    )
    data = (username, username)
    cursor.execute(query, data)
    try:
        username, email, firstname, lastname, pwhash = cursor.fetchone()
    except exception:
        cursor.close()
        cnx.close()
        return {'message': 'invalid username or password'}, 400
 
    # verify that the user even exists
    if pwhash:
        # verify hash from db against user-supplied pw
        ph = PasswordHasher.from_parameters(RFC_9106_HIGH_MEMORY)
        try:
            ph.verify(pwhash, password)
            # generate session token
            token = sha256(str(uuid4()).encode('utf-8')).hexdigest()
            # add token to db
            query = (
                'UPDATE users SET token=%s WHERE username=%s OR email=%s'
            )
            data = (token, username, username)
            cursor.execute(query, data)
            cnx.commit()
            cursor.close()
            cnx.close()
            return ({'username': username, 'email': email, 'firstname': firstname, 'lastname': lastname}, 200, {'Set-Cookie': f'token={token}; samesite=strict; max-age=604800; httponly'})
        except verifymismatcherror:
            cursor.close()
            cnx.close()
            return {'message': 'incorrect username/email or password'}, 401

    else:
        cursor.close()
        cnx.close()
        return {'message': 'invalid username or password'}, 400

@app.route('/api/logout', methods=['DELETE'])
def logout_user(): 
    token = request.cookies['token']
    if token:
        cnx = get_db_connection()
        cursor = cnx.cursor()
        query = (
            'UPDATE users SET token=NULL WHERE token=%s'
        )
        data = [token]
        cursor.execute(query, data)
        cnx.commit()
        cursor.close()
        cnx.close() 
        return ({'message': 'User logged out'}, 200, {'Set-Cookie': f'token=0; max-age=0'})
    else:
        return {'message': 'User not logged in'}, 400

@app.route('/api/streaks', methods=['GET', 'POST'])
def get_streaks():
    # check that user is logged in
    try:
        token = request.cookies['token']
        cnx = get_db_connection()
        cursor = cnx.cursor()
        query = (
            'SELECT id FROM users WHERE token=%s'
        )
        data = [token]
        cursor.execute(query, data)
        userID = None
        try:
            userID = cursor.fetchone()[0]
        except Exception:
            return {'message': 'Token invalid'}, 400

        # get streaks with userID
        query = (
            'SELECT * FROM streaks WHERE userID=%s'
        )
        data = [userID]
        cursor.execute(query, data)
        streak_rows = cursor.fetchall()
        streaks = []
        for streakID, streakName, _ in streak_rows:
            query = (
                'SELECT date FROM streak_history WHERE streakID=%s'
            )
            data = [streakID]
            cursor.execute(query, data)
            streakDates = [date[0] for date in cursor.fetchall()]
            streaks.append({'name': streakName, 'dates': streakDates, 'id': streakID})
        cursor.close()
        cnx.close()
        return {'streaks': streaks}, 200
    except KeyError:
        return {'message': 'User not logged in'}, 400

@app.route('/api/createStreak', methods=['GET', 'POST'])
def create_streak():
    streakName = request.form['streakName']
    # check that user is logged in
    token = request.cookies['token']
    if token:
        cnx = get_db_connection()
        cursor = cnx.cursor()
        query = (
            'SELECT id FROM users WHERE token=%s'
        )
        data = [token]
        cursor.execute(query, data)
        userID = None
        try:
            userID = cursor.fetchone()[0]
        except Exception:
            return {'message': 'Token invalid'}, 400
        
        # add streak to db
        query = (
            'INSERT INTO streaks VALUES (%s, %s)'
        )
        data = (streakName, userID)
        cursor.execute(query, data)
        cnx.commit()
        cursor.close()
        cnx.close()
        return {'message': streakName}, 200
    else:
        cursor.close()
        cnx.close()
        return {'message': 'User not logged in'}, 400


@app.route('/api/deleteStreak', methods=['POST'])
def delete_streak():
    streakID = request.json['id']
    # check that user is logged in
    token = request.cookies['token']
    if token:
        cnx = get_db_connection()
        cursor = cnx.cursor()
        query = (
            'SELECT id FROM users WHERE token=%s'
        )
        data = [token]
        cursor.execute(query, data)
        userID = None
        try:
            userID = cursor.fetchone()[0]
        except Exception:
            return {'message': 'Token invalid'}, 400
        
        # remove streak from db
        query = (
            'DELETE FROM streak_history WHERE streakID=%s'
        )
        data = (streakID,)
        cursor.execute(query, data)
        cnx.commit()

        query = (
            'DELETE FROM streaks WHERE id=%s'
        )
        cursor.execute(query, data)
        cnx.commit()
        cursor.close()
        cnx.close()
        return {'message': 'deleted'}, 200
    else:
        cursor.close()
        cnx.close()
        return {'message': 'User not logged in'}, 400

@app.route('/api/markStreakDone', methods=['POST'])
def markDone():
    cnx, cursor, query = None, None, None
    try:
        token = request.cookies['token']
        cnx = get_db_connection()
        cursor = cnx.cursor()
        query = (
            'SELECT email, username, firstName, lastName FROM users WHERE token=%s'
        )
        data = [token]
        cursor.execute(query, data)
        try:
            email, username, firstName, lastName = cursor.fetchone()
        except Exception:
            return {'message': 'Token invalid'}, 400
    except KeyError:
        return {'message': 'User not logged in'}, 401
    # user logged in
    streakID = request.json['id']
    streakDate = date.today().isoformat()
    query = (
        'INSERT INTO streak_history VALUES (%s, %s)'
    )
    data = (int(streakID), streakDate)
    try:
        cursor.execute(query, data)
        cnx.commit()
        cursor.close()
        cnx.close()
    except IntegrityError:
        return { 'message': 'already marked done today' }, 400
    return { 'message': 'success', 'date': streakDate }, 200

@app.route('/api/markStreaksDone', methods=['POST'])
def markMultipleDone():
    cnx, cursor, query = None, None, None
    try:
        token = request.cookies['token']
        cnx = get_db_connection()
        cursor = cnx.cursor()
        query = (
            'SELECT email, username, firstName, lastName FROM users WHERE token=%s'
        )
        data = [token]
        cursor.execute(query, data)
        try:
            email, username, firstName, lastName = cursor.fetchone()
        except Exception:
            return {'message': 'Token invalid'}, 400
    except KeyError:
        return {'message': 'User not logged in'}, 401
    # user logged in
    streakIDs = request.json['ids']
    streakDates = request.json['dates']
    query = (
        'INSERT INTO streak_history VALUES (%s, %s)'
    )
    errors = []
    for streakID in streakIDs:
        for streakDate in streakDates:
            data = (int(streakID), streakDate)
            try:
                cursor.execute(query, data)
                cnx.commit()
            except IntegrityError:
                errors.append({streakID: streakDate})
    cursor.close()
    cnx.close()
    if errors:
        return { 'message': '1 or more streaks were already done for 1 or more of the selected dates', 'failed': errors }, 400
    return { 'message': 'success' }, 200

@app.route('/api/markStreaksNotDone', methods=['POST'])
def markMultipleNotDone():
    cnx, cursor, query = None, None, None
    try:
        token = request.cookies['token']
        cnx = get_db_connection()
        cursor = cnx.cursor()
        query = (
            'SELECT email, username, firstName, lastName FROM users WHERE token=%s'
        )
        data = [token]
        cursor.execute(query, data)
        try:
            email, username, firstName, lastName = cursor.fetchone()
        except Exception:
            return {'message': 'Token invalid'}, 400
    except KeyError:
        return {'message': 'User not logged in'}, 401
    # user logged in
    streakIDs = request.json['ids']
    streakDates = request.json['dates']
    query = (
        'DELETE FROM streak_history WHERE streakID=%s AND date=%s'
    )
    errors = []
    for streakID in streakIDs:
        for streakDate in streakDates:
            data = (streakID, streakDate)
            try:
                cursor.execute(query, data)
                cnx.commit()
            except IntegrityError:
                errors.append({streakID: streakDate})
    cursor.close()
    cnx.close()
    if errors:
        return { 'message': '1 or more streaks were already done for 1 or more of the selected dates', 'failed': errors }, 400
    return { 'message': 'success' }, 200

@app.route('/api/renameStreak', methods=['POST'])
def renameStreak():
    cnx, cursor, query = None, None, None
    try:
        token = request.cookies['token']
        cnx = get_db_connection()
        cursor = cnx.cursor()
        query = (
            'SELECT email, username, firstName, lastName FROM users WHERE token=%s'
        )
        data = [token]
        cursor.execute(query, data)
        try:
            email, username, firstName, lastName = cursor.fetchone()
        except Exception:
            return {'message': 'Token invalid'}, 400
    except KeyError:
        return {'message': 'User not logged in'}, 401
    # user logged in 
    streakID = request.json['id']
    streakNewName = request.json['newName']

    # change streak name 
    updateQueryStreaks = 'UPDATE streaks SET name=%s WHERE id=%s'
    data = (streakNewName, streakID)
    cursor.execute(updateQueryStreaks, data)
    cnx.commit()

    cursor.close()
    cnx.close()
    return {'message': 'success'}, 200