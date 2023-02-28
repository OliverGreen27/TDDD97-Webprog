import random
import hashlib
import re

from flask import Flask, request

import database_helper as dbh


app = Flask(__name__)


@app.route('/')
def index():
    return 'Hello world!'


@app.route('/signin', methods=['POST'])
def sign_in():
    """
     Authenticate the username by the provided password.
    """

    args = request.get_json()

    if set(args) != {'email', 'password'}:
        return {"success": "false", "message": "Form data missing or incorrect type."}

    pw_hash = hashlib.sha256((args['password'] + args['email']).encode()).hexdigest()

    # TODO: test if empty email and password will sign in
    print(dbh.get_password(args['email']))
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


def sign_out(token):
    """
    Sign out a user from the system.
    """
    return


def change_password(token, oldPassword, newPassword):
    """
    Change the password of the current user to a new one.
    """
    pass


def get_user_data_by_token(token):
    #return email, firstname, familyname, gender, city, country
    pass


def get_user_data_by_email(token, email):
    #return email, firstname, familyname, gender, city, country
    message = {"status": "", "message": "", "data": ""}
    if dbh.get_token_from_email(email) == token:
        data = dbh.get_user_data(email)
        if data:
            message["data"] = data
    else:
        "you are not logged in"
        pass


def get_user_messages_by_token(token):
    #return messages
    pass


def get_user_messages_by_email(token, email):
    #return messages
    pass


def post_message(token, message, email):
    pass


app.run(host='0.0.0.0', port=5000)