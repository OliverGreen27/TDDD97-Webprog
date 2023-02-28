
CREATE TABLE "logged_in_users" (
    "email" TEXT,
	"token"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("email")
);

CREATE TABLE "user_data" (
	"email"	TEXT,
	"password_hash"	TEXT,
	"firstname"	TEXT,
	"familyname"	TEXT,
	"gender"	TEXT,
	"city"	TEXT,
	"country"	TEXT,
	PRIMARY KEY("email")
);

CREATE TABLE "user_messages" (
	"email"	TEXT,
	"message"	TEXT,
	PRIMARY KEY("email")
);