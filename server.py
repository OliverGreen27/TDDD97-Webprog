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
        return {}, 400
    
    token = dbh.get_token(args['email'])
    if token:
        return {"token" : token}, 200

    pw_hash = hashlib.sha256((args['password'] + args['email']).encode()).hexdigest()

    # TODO: test if empty email and password will sign in
    if pw_hash != dbh.get_password(args['email']):
        return {}, 404

    letters = "abcdefghiklmnopqrstuvwwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    token = ''.join(letters[random.randint(0,len(letters)-1)] for _ in range(36))
    
    dbh.update_logged_in_users(args['email'], token)

    return {"token" : token}, 200


@app.route('/signup', methods=['POST'])
def sign_up():
    """
    Register a user in the database.
    """
    args = request.get_json()

    if set(args) != {'email', 'password', 'firstname', 'familyname', 'gender', 'city', 'country'}:
        return {}, 400

    if re.fullmatch(r'\w+@\w+.\w+', args['email']) is None:
        return {}, 400

    if len(args['password']) < 8:
        return {}, 400

    if dbh.get_user_data(args['email']):
        return {}, 409

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
    return {}, 201


@app.route('/signout', methods=['POST'])
def sign_out():
    """
    Sign out a user from the system.
    """
    token = request.headers.get('Authorization')

    email = dbh.get_email(token)

    if not email:
        return {}, 404

    dbh.signout(token)

    return {}, 200


@app.route('/changepass', methods=['PUT'])
def change_password():
    """
    Change the password of the current user to a new one.
    """
    args = request.get_json()
    token = request.headers.get('Authorization')

    if set(args) != {'oldPassword', 'newPassword'}:
        return {}, 400

    email = dbh.get_email(token)    

    if not token or not email:
        return {}, 401

    if len(args['newPassword']) < 8:
        return {}, 400

    pw_hash = hashlib.sha256((args['oldPassword'] + email).encode()).hexdigest()

    # TODO: test if empty email and password will sign in
    if pw_hash != dbh.get_password(email):
        return {}, 404

    new_pw_hash = hashlib.sha256((args['newPassword'] + email).encode()).hexdigest()
    dbh.update_password(email, new_pw_hash)
    return {}, 200


@app.route('/get_user_data_by_token')
def get_user_data_by_token():

    token = request.headers.get('Authorization')
    email = dbh.get_email(token)

    if not token or not email:
        return {}, 401

    return get_user_data_by_email(email, token)


@app.route('/get_user_data_by_email')
def get_user_data_by_email(email=None, token=None):
    if not email and not token:
        email = request.args.get("email")
        if not email:
            return {}, 400
        token = request.headers.get('Authorization')
    
    if not dbh.get_email(token):
        return {}, 404

    data = dbh.get_user_data(email)

    if not data:
        return {}, 404
    
    data = {
        "email":     data[0],
        "firstname": data[2],
        "familyname":data[3],
        "gender":    data[4],
        "city":      data[5],
        "country":   data[6], 
    }

    return {"data" : data}, 200
    

@app.route('/get_user_messages_by_token')
def get_user_messages_by_token():
    #return messages
    token = request.headers.get('Authorization')
    email = dbh.get_email(token)
    if not token or not email:
        return {}, 401

    return get_user_messages_by_email(email, token)


@app.route('/get_user_messages_by_email')
def get_user_messages_by_email(email=None, token=None):
    #return messages
    if not email and not token:
        email = request.args.get("email")
        if not email:
            return {}, 400
        token = request.headers.get('Authorization')
    
    if not dbh.get_email(token):
        return {}, 401

    data = dbh.get_user_messages(email)
    
    messages = [{"writer":writer, "content":content} for writer, content in data]

    return {"messages" : messages}, 200


@app.route("/post_message", methods=['POST'])
def post_message():
    args = request.get_json()
    if set(args) != {'email', 'message'}:
        return {}, 400
    token = request.headers.get('Authorization')
    writer = dbh.get_email(token)
    if not writer:
        return {}, 401

    dbh.post_message(writer, args['email'], args['message'])

    return {}, 201


#app.run(host='0.0.0.0', port=5000)