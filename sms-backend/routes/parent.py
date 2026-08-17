# routes/parent.py
# WHY separate file? Parent has its own routes
# Parent sees their child's data only

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
import psycopg2
import os

parent_bp = Blueprint("parent", __name__)

def get_db():
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        port=os.getenv("DB_PORT")
    )
    return conn

# WHY a role check instead of an identity check (like student.py)?
# A parent's own token identity is their OWN id (e.g. "P501"), not the
# student_id in the URL — those will never match. Without a table linking
# parents to their specific child, the best we can currently verify is
# "is this definitely a logged-in parent?" — not "is this THEIR child?".
# That's a known gap worth mentioning if asked: a parent_child table would
# let us add a proper ownership check here later.
def require_parent():
    claims = get_jwt()
    return claims.get("role") == "Parent"


# ── GET child marks ──
# WHY same as student marks? Parent sees same data
@parent_bp.route("/api/parent/marks/<student_id>", methods=["GET"])
@jwt_required()
def get_child_marks(student_id):
    if not require_parent():
        return jsonify({"success": False, "message": "Access denied"}), 403
    try:
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, exam_type, math, physics, english FROM marks WHERE student_id=%s",
            (student_id,)
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        marks = [
            {
                "id":        row[0],
                "exam_type": row[1],
                "math":      row[2],
                "physics":   row[3],
                "english":   row[4]
            }
            for row in rows
        ]
        return jsonify({"success": True, "marks": marks})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ── GET child attendance ──
@parent_bp.route("/api/parent/attendance/<student_id>", methods=["GET"])
@jwt_required()
def get_child_attendance(student_id):
    if not require_parent():
        return jsonify({"success": False, "message": "Access denied"}), 403
    try:
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, subject, status, date FROM attendance WHERE student_id=%s",
            (student_id,)
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        attendance = [
            {
                "id":      row[0],
                "subject": row[1],
                "status":  row[2],
                "date":    str(row[3])
            }
            for row in rows
        ]
        return jsonify({"success": True, "attendance": attendance})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ── GET child remarks ──
@parent_bp.route("/api/parent/remarks/<student_id>", methods=["GET"])
@jwt_required()
def get_child_remarks(student_id):
    if not require_parent():
        return jsonify({"success": False, "message": "Access denied"}), 403
    try:
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, remark, date FROM remarks WHERE student_id=%s",
            (student_id,)
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        remarks = [
            {
                "id":     row[0],
                "remark": row[1],
                "date":   str(row[2])
            }
            for row in rows
        ]
        return jsonify({"success": True, "remarks": remarks})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500