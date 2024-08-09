from flask import Flask
from flask_cors import CORS
from utils.db import init_db
from routes import initialize_routes

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# Initialize database
init_db()

# Initialize routes
initialize_routes(app)

if __name__ == '__main__':
    app.run(debug=True)
