import sqlite3

con = sqlite3.connect("database.db", check_same_thread=False)

cur = con.cursor()


def query_db(query, args=(), fetchone=False, commit=False):
    res = cur.execute(query, args).fetchall()
    if commit:
        con.commit()
    return (res[0] if res else None) if fetchone else res


def get_token(email):
    return query_db(f"SELECT token FROM logged_in_users WHERE email=?;", (email,), fetchone=True)


def get_password(email):
    return query_db("SELECT password_hash FROM user_data WHERE email=?;", (email,), fetchone=True)


def update_logged_in_users(email, token):
    query_db("Insert INTO logged_in_users VALUES (?,?);", (email,token), commit=True)


def get_user_data(email):
    return query_db("SELECT * FROM user_data WHERE email=?;", (email,))


def create_user(email, pw_hash, fname, lname, gender, city, country):
    query_db(f"Insert INTO user_data VALUES (?,?,?,?,?,?,?);", (email, pw_hash, fname, lname, gender, city, country), commit=True)