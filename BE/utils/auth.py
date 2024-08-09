from flask import jsonify, request, g
from functools import wraps
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from config import GOOGLE_CLIENT_ID

def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"error": "Authorization header is missing", "result": "anda belum login"}), 403

        token = auth_header.split(" ")[1] if " " in auth_header else None

        if not token:
            return jsonify({"error": "Token is missing", "result": "anda belum login"}), 403

        try:
            id_info = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)
            g.user = id_info
        except ValueError:
            return jsonify({"error": "Invalid token", "result": "anda belum login"}), 403

        return f(*args, **kwargs)
    return wrap
