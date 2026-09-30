# routes/parent.py

from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity

from decorators import role_required
from models import (
    Marks,
    Attendance,
    Remarks,
    ParentChild
)


parent_bp = Blueprint("parent", __name__)


# ============================================================
# CHECK PARENT-CHILD RELATIONSHIP
# ============================================================

def is_parent_of_student(student_id):
    """
    Check whether the currently logged-in parent
    is actually linked to the requested student.

    Returns:
        True  -> parent is linked to student
        False -> parent is not linked to student
    """

    current_parent_id = get_jwt_identity()

    relationship = ParentChild.query.filter_by(
        parent_id=current_parent_id,
        student_id=student_id
    ).first()

    return relationship is not None


# ============================================================
# GET CHILD MARKS
# ============================================================

# React calls:
# GET /api/parent/marks/<student_id>
#
# Security:
# 1. Valid JWT required.
# 2. User must have parent role.
# 3. Parent must actually be linked to this student.
@parent_bp.route(
    "/api/parent/marks/<student_id>",
    methods=["GET"]
)
@role_required("parent")
def get_child_marks(student_id):

    # Check whether this parent is actually
    # related to the requested student.
    if not is_parent_of_student(student_id):
        return jsonify({
            "success": False,
            "message": "Access denied"
        }), 403

    try:
        rows = Marks.query.filter_by(
            student_id=student_id
        ).all()

        marks = [
            {
                "id": row.id,
                "exam_type": row.exam_type,
                "math": row.math,
                "physics": row.physics,
                "english": row.english,
                "created_at": str(row.created_at)
            }
            for row in rows
        ]

        return jsonify({
            "success": True,
            "marks": marks
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "Unable to retrieve child marks"
        }), 500


# ============================================================
# GET CHILD ATTENDANCE
# ============================================================

@parent_bp.route(
    "/api/parent/attendance/<student_id>",
    methods=["GET"]
)
@role_required("parent")
def get_child_attendance(student_id):

    # Parent must be linked to this student.
    if not is_parent_of_student(student_id):
        return jsonify({
            "success": False,
            "message": "Access denied"
        }), 403

    try:
        rows = Attendance.query.filter_by(
            student_id=student_id
        ).all()

        attendance = [
            {
                "id": row.id,
                "subject": row.subject,
                "status": row.status,
                "date": str(row.date)
            }
            for row in rows
        ]

        return jsonify({
            "success": True,
            "attendance": attendance
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "Unable to retrieve child attendance"
        }), 500


# ============================================================
# GET CHILD REMARKS
# ============================================================

@parent_bp.route(
    "/api/parent/remarks/<student_id>",
    methods=["GET"]
)
@role_required("parent")
def get_child_remarks(student_id):

    # Parent must be linked to this student.
    if not is_parent_of_student(student_id):
        return jsonify({
            "success": False,
            "message": "Access denied"
        }), 403

    try:
        rows = Remarks.query.filter_by(
            student_id=student_id
        ).all()

        remarks = [
            {
                "id": row.id,
                "remark": row.remark,
                "date": str(row.date)
            }
            for row in rows
        ]

        return jsonify({
            "success": True,
            "remarks": remarks
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "Unable to retrieve child remarks"
        }), 500