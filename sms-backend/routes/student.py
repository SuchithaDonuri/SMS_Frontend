# routes/student.py

from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity

from decorators import role_required
from models import Marks, Attendance, Remarks, Timetable, Student


student_bp = Blueprint("student", __name__)


# ============================================================
# GET MARKS
# ============================================================

# React calls:
# GET /api/student/marks/S1001
#
# Security:
# 1. User must have a valid JWT.
# 2. User must have the "student" role.
# 3. The student_id in the URL must match the logged-in student.
@student_bp.route(
    "/api/student/marks/<student_id>",
    methods=["GET"]
)
@role_required("student")
def get_marks(student_id):

    current_user_id = get_jwt_identity()

    # A student can only access their own marks.
    if current_user_id != student_id:
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
            "message": "Unable to retrieve marks"
        }), 500


# ============================================================
# GET ATTENDANCE
# ============================================================

# React calls:
# GET /api/student/attendance/S1001
#
# Security:
# Student can only see their own attendance.
@student_bp.route(
    "/api/student/attendance/<student_id>",
    methods=["GET"]
)
@role_required("student")
def get_attendance(student_id):

    current_user_id = get_jwt_identity()

    # A student can only access their own attendance.
    if current_user_id != student_id:
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
            "message": "Unable to retrieve attendance"
        }), 500


# ============================================================
# GET REMARKS
# ============================================================

# React calls:
# GET /api/student/remarks/S1001
#
# Security:
# Student can only see their own remarks.
@student_bp.route(
    "/api/student/remarks/<student_id>",
    methods=["GET"]
)
@role_required("student")
def get_remarks(student_id):

    current_user_id = get_jwt_identity()

    # A student can only access their own remarks.
    if current_user_id != student_id:
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
            "message": "Unable to retrieve remarks"
        }), 500


# ============================================================
# GET STUDENT TIMETABLE
# ============================================================

# React calls:
# GET /api/student/timetable/<class_name>
#
# Security:
# 1. User must be a student.
# 2. We find the logged-in student's class.
# 3. The requested class must match the student's actual class.
#
# This prevents a student from requesting another class's timetable.
@student_bp.route(
    "/api/student/timetable/<class_name>",
    methods=["GET"]
)
@role_required("student")
def get_student_timetable(class_name):

    current_user_id = get_jwt_identity()

    try:
        # Find the logged-in student in the students table.
        student = Student.query.filter_by(
            student_id=current_user_id
        ).first()

        # The JWT may be valid, but the student record
        # must also exist in the students table.
        if not student:
            return jsonify({
                "success": False,
                "message": "Student record not found"
            }), 404

        # Compare the class requested by the frontend
        # with the student's actual class.
        if student.class_name != class_name:
            return jsonify({
                "success": False,
                "message": "Access denied"
            }), 403

        # Only after authorization succeeds do we retrieve
        # the timetable.
        rows = Timetable.query.filter_by(
            class_name=class_name
        ).all()

        timetable = [
            {
                "day": row.day,
                "P1": {
                    "sub": row.p1_subject,
                    "tid": row.p1_teacher
                },
                "P2": {
                    "sub": row.p2_subject,
                    "tid": row.p2_teacher
                },
                "P3": {
                    "sub": row.p3_subject,
                    "tid": row.p3_teacher
                },
                "P4": {
                    "sub": row.p4_subject,
                    "tid": row.p4_teacher
                },
                "P5": {
                    "sub": row.p5_subject,
                    "tid": row.p5_teacher
                }
            }
            for row in rows
        ]

        return jsonify({
            "success": True,
            "timetable": timetable
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "Unable to retrieve timetable"
        }), 500