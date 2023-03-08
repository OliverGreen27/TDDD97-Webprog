import sqlite3

con = sqlite3.connect("database.db", check_same_thread=False)

cur = con.cursor()


def query_db(query, args=(), fetchone=False, commit=False):
    res = cur.execute(query, args)
    if commit:
        con.commit()
    else:
        data = res.fetchall()
        return (data[0] if data else None) if fetchone else data


def get_token(email):
    res = query_db(f"SELECT token FROM logged_in_users WHERE email=?;", (email,), fetchone=True)
    return res[0] if res else None


def signout(token):
    query_db(f"DELETE FROM logged_in_users WHERE token=?;", (token,), commit=True)


def get_email(token):
    res = query_db(f"SELECT email FROM logged_in_users WHERE token=?;", (token,), fetchone=True)
    return res[0] if res else None


def get_password(email):
    res = query_db("SELECT password_hash FROM user_data WHERE email=?;", (email,), fetchone=True) 
    return res[0] if res else None


def update_logged_in_users(email, token):
    query_db("INSERT INTO logged_in_users VALUES (?,?);", (email,token), commit=True)


def get_user_data(email):
    res = query_db("SELECT * FROM user_data WHERE email=?;", (email,), fetchone=True)
    return res

def get_user_messages(email):
    res = query_db("SELECT writer, message FROM user_messages WHERE email=?;", (email,))
    return res

def post_message(writer, email, message):
    query_db(f"INSERT INTO user_messages (writer, email, message) VALUES (?,?,?);", (writer, email, message), commit=True)


def create_user(email, pw_hash, fname, lname, gender, city, country):
    query_db(f"INSERT INTO user_data VALUES (?,?,?,?,?,?,?);", (email, pw_hash, fname, lname, gender, city, country), commit=True)


def update_password(email, password):
    query_db(f"UPDATE user_data SET password_hash=? WHERE email=?", (password, email), commit=True)