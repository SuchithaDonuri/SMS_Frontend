from functools import wraps

from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt


def role_required(*allowed_roles):
    """
    Protect a route so that only users with one of the
    specified roles can access it.
    """

    normalized_roles = {
        role.strip().lower()
        for role in allowed_roles
    }

    def decorator(function):
        @wraps(function)
        @jwt_required()
        def wrapper(*args, **kwargs):

            claims = get_jwt()

            user_role = claims.get("role", "").strip().lower()

            if user_role not in normalized_roles:
                return jsonify({
                    "success": False,
                    "message": "Access denied"
                }), 403

            return function(*args, **kwargs)

        return wrapper

    return decorator