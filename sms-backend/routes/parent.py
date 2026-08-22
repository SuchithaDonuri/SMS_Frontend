# routes/parent.py
# WHY separate file? Parent has its own routes
# Parent sees their child's data only

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models import Marks, Attendance, Remarks

parent_bp = Blueprint("parent", __name__)

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
        rows = Marks.query.filter_by(student_id=student_id).all()
        marks = [
            {
                "id":        row.id,
                "exam_type": row.exam_type,
                "math":      row.math,
                "physics":   row.physics,
                "english":   row.english
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
        rows = Attendance.query.filter_by(student_id=student_id).all()
        attendance = [
            {
                "id":      row.id,
                "subject": row.subject,
                "status":  row.status,
                "date":    str(row.date)
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
        rows = Remarks.query.filter_by(student_id=student_id).all()
        remarks = [
            {
                "id":     row.id,
                "remark": row.remark,
                "date":   str(row.date)
            }
            for row in rows
        ]
        return jsonify({"success": True, "remarks": remarks})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500