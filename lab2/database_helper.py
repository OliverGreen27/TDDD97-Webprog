import sqlite3

con = sqlite3.connect("database.db", check_same_thread=False)

cur = con.cursor()


def get_token(email):
    res = cur.execute(f"SELECT token FROM logged_in_users WHERE email=?;", (email,))
    return res.fetchone()


def get_password(email):

    res = cur.execute("SELECT password_hash FROM user_data WHERE email=?;", (email,))
    
    return res.fetchone()


def update_logged_in_users(email, token):

    cur.execute("Insert INTO logged_in_users VALUES (?,?);", (email,token))


def get_user_data(email):
    data = cur.execute("SELECT * FROM user_data WHERE email=?;", (email,))
    return data.fetchall()


def create_user(email, pw_hash, fname, lname, gender, city, country):
    cur.execute(f"Insert INTO user_data VALUES (?,?,?,?,?,?,?);", (email, pw_hash, fname, lname, gender, city, country))