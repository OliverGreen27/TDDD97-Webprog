# TDDD97

This repo contains the laborations in the course TDDD97 done by Gustav and Oliver.

## How to run the code

0. Clone the repository and open the TDDD97 directory in your bash terminal.

1. Create and run a python virtual environment using *venv*
```bash
python3 -m venv venv
source venv/bin/activate
```

2. Install the required python packages using *pip install*

```bash
pip install -r requirements.txt
```

3. Create the database using sqlite3 and the file *schema.sql*.
```bash
sqlite3 database.db < schema.sql
```

4. Run the server with *gunicorn*
```bash
gunicorn -b 0.0.0.0:5000 --workers 1 --threads 100 server:app
```

5. Use a web browser of your choice and go to localhost port 5000
```
localhost:5000/
```