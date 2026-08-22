# routes/principal.py

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models import User, Student, Marks, Attendance, Remarks

principal_bp = Blueprint("principal", __name__)


def require_principal():
    claims = get_jwt()
    # FIXED — the old version was "principal".lower(), which just
    # evaluates to "principal" and never actually checks claims.get("role")
    # at all. This always compared "principal" against a fixed string,
    # meaning a real principal's role could still fail this check if it
    # wasn't stored in that exact case. This now correctly lowercases the
    # ACTUAL role from the token before comparing.
    return claims.get("role", "").lower() == "principal"


# ── GET all students ──
@principal_bp.route("/api/principal/students", methods=["GET"])
@jwt_required()
def get_all_students():
    if not require_principal():
        return jsonify({"success": False, "message": "Access denied"}), 403
    try:
        rows = User.query.filter_by(role="student").all()
        students = [{"id": row.id} for row in rows]
        return jsonify({"success": True, "students": students})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ── GET all teachers ──
@principal_bp.route("/api/principal/teachers", methods=["GET"])
@jwt_required()
def get_all_teachers():
    if not require_principal():
        return jsonify({"success": False, "message": "Access denied"}), 403
    try:
        rows = User.query.filter_by(role="teacher").all()
        teachers = [{"id": row.id} for row in rows]
        return jsonify({"success": True, "teachers": teachers})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ── GET all marks ──
@principal_bp.route("/api/principal/marks", methods=["GET"])
@jwt_required()
def get_all_marks():
    if not require_principal():
        return jsonify({"success": False, "message": "Access denied"}), 403
    try:
        rows = Marks.query.all()
        marks = [
            {
                "id":         row.id,
                "student_id": row.student_id,
                "exam_type":  row.exam_type,
                "math":       row.math,
                "physics":    row.physics,
                "english":    row.english
            }
            for row in rows
        ]
        return jsonify({"success": True, "marks": marks})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ── GET all attendance ──
@principal_bp.route("/api/principal/attendance", methods=["GET"])
@jwt_required()
def get_all_attendance():
    if not require_principal():
        return jsonify({"success": False, "message": "Access denied"}), 403
    try:
        rows = Attendance.query.all()
        attendance = [
            {
                "id":         row.id,
                "student_id": row.student_id,
                "subject":    row.subject,
                "status":     row.status,
                "date":       str(row.date)
            }
            for row in rows
        ]
        return jsonify({"success": True, "attendance": attendance})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ── GET students filtered by class + section ──
@principal_bp.route("/api/principal/students/<class_name>/<section>", methods=["GET"])
@jwt_required()
def get_students_by_class(class_name, section):
    if not require_principal():
        return jsonify({"success": False, "message": "Access denied"}), 403
    try:
        # WHY straightforward here? No JOIN needed — the students table
        # already has class_name and section directly on it
        rows = Student.query.filter_by(class_name=class_name, section=section).all()
        students = [{"id": row.student_id} for row in rows]
        return jsonify({"success": True, "students": students})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ── GET marks for students in a specific class + section ──
@principal_bp.route("/api/principal/marks/<class_name>/<section>", methods=["GET"])
@jwt_required()
def get_marks_by_class(class_name, section):
    if not require_principal():
        return jsonify({"success": False, "message": "Access denied"}), 403
    try:
        # WHY two steps instead of one JOIN query? Your raw SQL joined
        # marks + students directly in one SQL statement. The ORM way of
        # achieving the same result, in a simpler and more readable form,
        # is to do it in two clear steps:
        #
        # Step 1: find which students belong to this class+section
        matching_students = Student.query.filter_by(
            class_name=class_name, section=section
        ).all()
        student_ids = [s.student_id for s in matching_students]

        # Step 2: find all marks belonging to any of those students.
        # WHY .in_()? This is the ORM equivalent of SQL's
        # "WHERE student_id IN (id1, id2, id3, ...)"
        rows = Marks.query.filter(Marks.student_id.in_(student_ids)).all()

        marks = [
            {
                "student_id": row.student_id,
                "exam_type":  row.exam_type,
                "math":       row.math,
                "physics":    row.physics,
                "english":    row.english
            }
            for row in rows
        ]
        return jsonify({"success": True, "marks": marks})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ── GET attendance for students in a specific class + section ──
@principal_bp.route("/api/principal/attendance/<class_name>/<section>", methods=["GET"])
@jwt_required()
def get_attendance_by_class(class_name, section):
    if not require_principal():
        return jsonify({"success": False, "message": "Access denied"}), 403
    try:
        matching_students = Student.query.filter_by(
            class_name=class_name, section=section
        ).all()
        student_ids = [s.student_id for s in matching_students]

        rows = Attendance.query.filter(Attendance.student_id.in_(student_ids)).all()

        attendance = [
            {
                "student_id": row.student_id,
                "subject":    row.subject,
                "status":     row.status,
                "date":       str(row.date)
            }
            for row in rows
        ]
        return jsonify({"success": True, "attendance": attendance})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ── GET remarks for students in a specific class + section ──
@principal_bp.route("/api/principal/remarks/<class_name>/<section>", methods=["GET"])
@jwt_required()
def get_remarks_by_class(class_name, section):
    if not require_principal():
        return jsonify({"success": False, "message": "Access denied"}), 403
    try:
        matching_students = Student.query.filter_by(
            class_name=class_name, section=section
        ).all()
        student_ids = [s.student_id for s in matching_students]

        rows = Remarks.query.filter(Remarks.student_id.in_(student_ids)).all()

        remarks = [
            {
                "student_id": row.student_id,
                "remark":     row.remark,
                "date":       str(row.date)
            }
            for row in rows
        ]
        return jsonify({"success": True, "remarks": remarks})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500