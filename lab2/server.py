import random
import hashlib

from flask import Flask

import database_helper as dbh


app = Flask(__name__)


@app.route('/')
def index():
    return 'Hello world!'


@app.route('/signin')
def sign_in(email='test@gmail.com', password='123123123'):
    """
     Authenticate the username by the provided password.
    """
    hashed_password = hashlib.sha256((password + email).encode()).hexdigest()

    database_password = dbh.get_password(email)

    if hashed_password == database_password:
        letters = "abcdefghiklmnopqrstuvwwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
        token = ''.join(letters[random.randint(0,len(letters)-1)] for _ in range(36))
#       syncStorage();
#       if(users[email] != null && users[email].password == password){
#         loggedInUsers[token] = email;
#         persistLoggedInUsers();
        return { "success": "true", "message": "Successfully signed in.", "data": token }

    return { "success": "false", "message": "Wrong username or password." }

@app.route('/signup')
def sign_up(jsonObj):
    """
    Register a user in the database.
    """
    pass


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