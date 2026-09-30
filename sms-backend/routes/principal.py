# routes/principal.py

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from sqlalchemy import func

from extensions import db
from models import User, Student, Marks, Attendance, Remarks


principal_bp = Blueprint("principal", __name__)


# ============================================================
# PRINCIPAL AUTHORIZATION
# ============================================================

def require_principal():
    claims = get_jwt()

    role = claims.get("role", "")

    return str(role).lower() == "principal"


def access_denied():
    return jsonify({
        "success": False,
        "message": "Access denied"
    }), 403


# ============================================================
# PRINCIPAL DASHBOARD SUMMARY
# ============================================================

@principal_bp.route(
    "/api/principal/dashboard-summary",
    methods=["GET"]
)
@jwt_required()
def get_dashboard_summary():

    if not require_principal():
        return access_denied()

    try:

        student_count = Student.query.count()

        teacher_count = User.query.filter(
            func.lower(User.role) == "teacher"
        ).count()

        class_count = db.session.query(
            func.count(
                func.distinct(Student.class_name)
            )
        ).scalar() or 0

        marks_count = Marks.query.count()

        return jsonify({
            "success": True,
            "summary": {
                "students": student_count,
                "teachers": teacher_count,
                "classes": class_count,
                "marks_records": marks_count
            }
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ============================================================
# GET STUDENTS BY CLASS + SECTION
# ============================================================

@principal_bp.route(
    "/api/principal/students/<class_name>/<section>",
    methods=["GET"]
)
@jwt_required()
def get_students_by_class(class_name, section):

    if not require_principal():
        return access_denied()

    try:

        students = Student.query.filter_by(
            class_name=class_name,
            section=section
        ).all()

        result = []

        for student in students:
            result.append({
                "id": student.student_id,
                "class_name": student.class_name,
                "section": student.section
            })

        return jsonify({
            "success": True,
            "students": result
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ============================================================
# GET ONE STUDENT'S MARKS
# PRINCIPAL = READ ONLY
# ============================================================

@principal_bp.route(
    "/api/principal/student/<student_id>/marks",
    methods=["GET"]
)
@jwt_required()
def get_student_marks(student_id):

    if not require_principal():
        return access_denied()

    try:

        rows = Marks.query.filter_by(
            student_id=student_id
        ).all()

        marks = []

        for row in rows:

            marks.append({
                "id": row.id,
                "student_id": row.student_id,
                "exam_type": row.exam_type,
                "math": row.math,
                "physics": row.physics,
                "english": row.english
            })

        return jsonify({
            "success": True,
            "marks": marks
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ============================================================
# GET ONE STUDENT'S ATTENDANCE
# PRINCIPAL = READ ONLY
# ============================================================

@principal_bp.route(
    "/api/principal/student/<student_id>/attendance",
    methods=["GET"]
)
@jwt_required()
def get_student_attendance(student_id):

    if not require_principal():
        return access_denied()

    try:

        rows = Attendance.query.filter_by(
            student_id=student_id
        ).all()

        attendance = []

        for row in rows:

            attendance.append({
                "id": row.id,
                "student_id": row.student_id,
                "subject": row.subject,
                "status": row.status,
                "date": str(row.date)
            })

        return jsonify({
            "success": True,
            "attendance": attendance
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ============================================================
# GET ONE STUDENT'S REMARKS
# PRINCIPAL = READ ONLY
# ============================================================

@principal_bp.route(
    "/api/principal/student/<student_id>/remarks",
    methods=["GET"]
)
@jwt_required()
def get_student_remarks(student_id):

    if not require_principal():
        return access_denied()

    try:

        rows = Remarks.query.filter_by(
            student_id=student_id
        ).all()

        remarks = []

        for row in rows:

            remarks.append({
                "id": row.id,
                "student_id": row.student_id,
                "remark": row.remark,
                "date": str(row.date)
            })

        return jsonify({
            "success": True,
            "remarks": remarks
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ============================================================
# GET ALL MARKS
# ============================================================

@principal_bp.route(
    "/api/principal/marks",
    methods=["GET"]
)
@jwt_required()
def get_all_marks():

    if not require_principal():
        return access_denied()

    try:

        rows = Marks.query.all()

        marks = []

        for row in rows:

            marks.append({
                "id": row.id,
                "student_id": row.student_id,
                "exam_type": row.exam_type,
                "math": row.math,
                "physics": row.physics,
                "english": row.english
            })

        return jsonify({
            "success": True,
            "marks": marks
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ============================================================
# GET ALL ATTENDANCE
# ============================================================

@principal_bp.route(
    "/api/principal/attendance",
    methods=["GET"]
)
@jwt_required()
def get_all_attendance():

    if not require_principal():
        return access_denied()

    try:

        rows = Attendance.query.all()

        attendance = []

        for row in rows:

            attendance.append({
                "id": row.id,
                "student_id": row.student_id,
                "subject": row.subject,
                "status": row.status,
                "date": str(row.date)
            })

        return jsonify({
            "success": True,
            "attendance": attendance
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ============================================================
# GET ALL REMARKS
# ============================================================

@principal_bp.route(
    "/api/principal/remarks",
    methods=["GET"]
)
@jwt_required()
def get_all_remarks():

    if not require_principal():
        return access_denied()

    try:

        rows = Remarks.query.all()

        remarks = []

        for row in rows:

            remarks.append({
                "id": row.id,
                "student_id": row.student_id,
                "remark": row.remark,
                "date": str(row.date)
            })

        return jsonify({
            "success": True,
            "remarks": remarks
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
        
        
# ── GET marks for one student — PRINCIPAL READ ONLY ──
@principal_bp.route("/api/principal/student/<student_id>/marks", methods=["GET"])
@jwt_required()
def get_principal_student_marks(student_id):

    if not require_principal():
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
                "student_id": row.student_id,
                "exam_type": row.exam_type,
                "math": row.math,
                "physics": row.physics,
                "english": row.english
            }
            for row in rows
        ]

        return jsonify({
            "success": True,
            "marks": marks
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500