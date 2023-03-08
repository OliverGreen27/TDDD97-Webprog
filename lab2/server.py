import random
import hashlib
import re

from flask import Flask, request

import database_helper as dbh


app = Flask(__name__)

@app.route('/')
def index():
    return app.send_static_file("client.html"), 200


@app.route('/signin', methods=['POST'])
def sign_in():
    """
     Authenticate the username by the provided password.
    """

    args = request.get_json()

    if set(args) != {'email', 'password'}:
        return {"success": "false", "message": "Form data missing or incorrect type."}
    
    token = dbh.get_token(args['email'])
    if token:
        return { "success": "true", "message": "Successfully signed in.", "data": token }

    pw_hash = hashlib.sha256((args['password'] + args['email']).encode()).hexdigest()

    # TODO: test if empty email and password will sign in
    if pw_hash != dbh.get_password(args['email']):
        return { "success": "false", "message": "Wrong username or password." }

    letters = "abcdefghiklmnopqrstuvwwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    token = ''.join(letters[random.randint(0,len(letters)-1)] for _ in range(36))
    
    dbh.update_logged_in_users(args['email'], token)

    return { "success": "true", "message": "Successfully signed in.", "data": token }


@app.route('/signup', methods=['POST'])
def sign_up():
    """
    Register a user in the database.
    """
    args = request.get_json()

    if set(args) != {'email', 'password', 'firstname', 'familyname', 'gender', 'city', 'country'}:
        return {"success": "false", "message": "Form data missing or incorrect type."}

    if re.fullmatch(r'\w+@\w+.\w+', args['email']) is None:
        return {"success": "false", "message": "Invalid email address."}

    if len(args['password']) < 8:
        return {"success": "false", "message": "Password needs to be at least 8 characters long."}

    print(dbh.get_user_data(args['email']))
    if dbh.get_user_data(args['email']):
        return {"success": "false", "message": "User already exists."}

    pw_hash = hashlib.sha256((args['password'] + args['email']).encode()).hexdigest()

    dbh.create_user(
        args['email'],
        pw_hash,
        args['firstname'],
        args['familyname'],
        args['gender'],
        args['city'],
        args['country'],
    )
    return {"success": "true", "message": "Successfully created a new user."}


@app.route('/signout', methods=['POST'])
def sign_out():
    """
    Sign out a user from the system.
    """
    token = request.headers.get('Authorization')

    if not token or not dbh.get_email(token):
        return {"success": "false", "message": "User is not signed in."}

    dbh.signout(token)

    return {"success": "true", "message": "Successfully signed out."}


@app.route('/changepass', methods=['POST'])
def change_password():
    """
    Change the password of the current user to a new one.
    """
    args = request.get_json()
    token = request.headers.get('Authorization')

    if set(args) != {'oldPassword', 'newPassword'}:
        return {"success": "false", "message": "Form data missing or incorrect type."}

    email = dbh.get_email(token)    

    if not token:
        return {"success": "false", "message": "No authorization token sent."}

    if not email:
        return {"success": "false", "message": "User is not signed in."}

    if len(args['newPassword']) < 8:
        return {"success": "false", "message": "Password needs to be at least 8 characters long."}

    pw_hash = hashlib.sha256((args['oldPassword'] + email).encode()).hexdigest()

    # TODO: test if empty email and password will sign in
    if pw_hash != dbh.get_password(email):
        return { "success": "false", "message": "Wrong password." }

    new_pw_hash = hashlib.sha256((args['newPassword'] + email).encode()).hexdigest()
    dbh.update_password(email, new_pw_hash)
    return {"success": "true", "message": "Password changed."}


@app.route('/get_user_data_by_token', methods=['POST'])
def get_user_data_by_token():

    token = request.headers.get('Authorization')

    if not token:
        return {"success": "false", "message": "No authorization token sent."}

    email = dbh.get_email(token)
    if not email:
        return {"success": "false", "message": "You are not signed in."}

    data = get_user_data_by_email(email, token)['data'] 
    return {"success": "true", "message": "Successfully fetched data", "data": data}


@app.route('/get_user_data_by_email', methods=['POST'])
def get_user_data_by_email(email=None, token=None):
    if not email and not token:
        args = request.get_json()
        if set(args) != {'email'}:
            return {"success": "false", "message": "Form data missing or incorrect type."}
        email = args['email']
        token = request.headers.get('Authorization')
    
    if not dbh.get_email(token):
        return {"success": "false", "message": "You are not signed in."}

    data = dbh.get_user_data(email)
    print("get_user_data:",data)

    if not data:
        return {"success": "false", "message": "The user does not exist."}
    
    data = {
        "email":     data[0],
        "firstname": data[2],
        "familyname":data[3],
        "gender":    data[4],
        "city":      data[5],
        "country":   data[6], 
    }

    return {"success": "true", "message": "Successfully fetched data", "data": data}
    

@app.route('/get_user_messages_by_token', methods=['POST'])
def get_user_messages_by_token():
    #return messages
    token = request.headers.get('Authorization')
    email = dbh.get_email(token)
    if not email:
        return {"success": "false", "message": "User is not signed in."}

    data = get_user_messages_by_email(email, token)['data'] 
    return {"success": "true", "message": "Successfully fetched messages", "data": data}


@app.route('/get_user_messages_by_email', methods=['POST'])
def get_user_messages_by_email(email=None, token=None):
    #return messages
    if not email and not token:
        args = request.get_json()
        if 'email' not in args:
            return {"success": "false", "message": "Form data missing or incorrect type."}
        email = args['email']
        token = request.headers.get('Authorization')
    
    if not dbh.get_email(token):
        return {"success": "false", "message": "You are not signed in."}

    data = dbh.get_user_messages(email)
    
    messages = [{"writer":writer, "content":content} for writer, content in data]

    return {"success": "true", "message": "Successfully fetched data", "data": messages}


@app.route("/post_message", methods=['POST'])
def post_message():
    args = request.get_json()
    if set(args) != {'email', 'message'}:
        return {"success": "false", "message": "Form data missing or incorrect type."}
    token = request.headers.get('Authorization')
    writer = dbh.get_email(token)
    if not writer:
        return {"success": "false", "message": "You are not signed in."}

    dbh.post_message(writer, args['email'], args['message'])

    return {"success": "true", "message": "Message posted."}



app.run(host='0.0.0.0', port=5000)