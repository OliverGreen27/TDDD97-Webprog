import sqlite3

con = sqlite3.connect("database.db")

cur = con.cursor()

def get_token_from_email(email):
    res = cur.execute(f"SELECT token FROM logged_in_users WHERE email='{email}'")
    return res.fetchone()

def get_password(email):

    res = cur.execute(f"SELECT password_hash FROM user_data WHERE email='{email}'")
    
    return res.fetchone()


def update_logged_in_users(email, token):

    cur.execute(f"Insert INTO logged_in_users")
    


def get_user_data(email):
    data = cur.execute(f"SELECT * FROM user_data WHERE email='{email}'")
    return data.fetchall()

