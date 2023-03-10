DROP TABLE IF EXISTS logged_in_users;
DROP TABLE IF EXISTS user_data;
DROP TABLE IF EXISTS user_messages;

CREATE TABLE logged_in_users (
    "email" TEXT,
	"token"	TEXT,
	PRIMARY KEY("email")
);

CREATE TABLE user_data (
	"email"	TEXT,
	"password_hash"	TEXT,
	"firstname"	TEXT,
	"familyname"	TEXT,
	"gender"	TEXT,
	"city"	TEXT,
	"country"	TEXT,
	PRIMARY KEY("email")
);

CREATE TABLE user_messages (
	"id"		INTEGER,
	"writer"	TEXT,
	"email"	    TEXT,
	"message"	TEXT,
	PRIMARY KEY("id")
);