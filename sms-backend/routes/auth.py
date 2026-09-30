from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
from sqlalchemy import func

from models import User


auth_bp = Blueprint("auth", __name__)


# ─────────────────────────────────────────────
# LOGIN ROUTE
# ─────────────────────────────────────────────
@auth_bp.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    user_id = data.get("id")
    password = data.get("password")
    role = data.get("role")

    # Basic request validation
    if not user_id or not password or not role:
        return jsonify({
            "success": False,
            "message": "User ID, password and role are required"
        }), 400

    try:
        # Find the user using ID and role.
        #
        # We intentionally do NOT check the password
        # inside the database query.
        user = User.query.filter(
            User.id == user_id,
            func.lower(User.role) == func.lower(role)
        ).first()

        # User does not exist
        if not user:
            return jsonify({
                "success": False,
                "message": "Invalid credentials"
            }), 401

        # Check the entered password against
        # the hashed password stored in the database.
        if not check_password_hash(user.password, password):
            return jsonify({
                "success": False,
                "message": "Invalid credentials"
            }), 401

        # Create JWT after successful authentication
        access_token = create_access_token(
            identity=user.id,
            additional_claims={
                "role": user.role
            }
        )

        return jsonify({
            "success": True,
            "token": access_token,
            "user": {
                "id": user.id,
                "role": user.role
            }
        }), 200

    except Exception:
        # Do not expose internal server/database
        # error details to the client.
        return jsonify({
            "success": False,
            "message": "An internal server error occurred"
        }), 500