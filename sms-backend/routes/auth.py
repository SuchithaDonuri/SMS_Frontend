# routes/auth.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from sqlalchemy import func
from models import User

auth_bp = Blueprint("auth", __name__)

# ── LOGIN Route ──
@auth_bp.route("/api/login", methods=["POST"])
def login():
    data     = request.get_json()
    user_id  = data.get("id")
    password = data.get("password")
    role     = data.get("role")

    try:
        # WHY func.lower()? Your raw SQL used LOWER(role)=LOWER(%s) to
        # match roles regardless of capitalization ("Student" vs "student").
        # func.lower() is SQLAlchemy's way of calling that same PostgreSQL
        # LOWER() function from Python — this preserves your exact
        # case-insensitive matching behavior, unchanged.
        user = User.query.filter(
            User.id == user_id,
            User.password == password,
            func.lower(User.role) == func.lower(role)
        ).first()

        if user:
            access_token = create_access_token(
                identity=user.id,
                additional_claims={"role": user.role}
            )
            return jsonify({
                "success": True,
                "token": access_token,
                "user": { "id": user.id, "role": user.role }
            })
        else:
            return jsonify({"success": False, "message": "Invalid credentials"}), 401

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500