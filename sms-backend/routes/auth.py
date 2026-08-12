# routes/auth.py

# WHY Blueprint? Creates a mini-app for auth routes only
# Instead of writing @app.route, we write @auth_bp.route
from flask import Blueprint, request, jsonify
import psycopg2
import os

# WHY "auth"? This is the name of this blueprint
auth_bp = Blueprint("auth", __name__)

# WHY this function here too?
# Each file needs its own db connection function
# Because each file is independent
def get_db():
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        port=os.getenv("DB_PORT")
    )
    return conn

# ── LOGIN Route ──
@auth_bp.route("/api/login", methods=["POST"])
def login():
    data     = request.get_json()
    user_id  = data.get("id")
    password = data.get("password")
    role     = data.get("role")

    try:
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, role FROM users WHERE id=%s AND password=%s AND role=%s",
            (user_id, password, role)
        )
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user:
            return jsonify({
                "success": True,
                "user": { "id": user[0], "role": user[1] }
            })
        else:
            return jsonify({
                "success": False,
                "message": "Invalid credentials"
            }), 401

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500