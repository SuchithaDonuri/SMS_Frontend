# routes/student.py

# WHY student_bp? All student routes grouped in one blueprint
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Marks, Attendance, Remarks, Timetable

student_bp = Blueprint("student", __name__)

# ── GET Marks ──
# React calls: GET /api/student/marks/S1001
@student_bp.route("/api/student/marks/<student_id>", methods=["GET"])
@jwt_required()
def get_marks(student_id):

    current_user_id = get_jwt_identity()
    if current_user_id != student_id:
        return jsonify({"success": False, "message": "Access denied"}), 403

    try:
        # WHY .filter_by(...).all()? This is the ORM equivalent of:
        # SELECT * FROM marks WHERE student_id=%s
        # .all() returns EVERY matching row as a list of Marks objects —
        # same idea as fetchall(), just with named objects instead of tuples
        rows = Marks.query.filter_by(student_id=student_id).all()

        marks = [
            {
                "id":         row.id,
                "exam_type":  row.exam_type,
                "math":       row.math,
                "physics":    row.physics,
                "english":    row.english,
                "created_at": str(row.created_at)
            }
            for row in rows
        ]
        return jsonify({"success": True, "marks": marks})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ── GET Attendance ──
# React calls: GET /api/student/attendance/S1001
@student_bp.route("/api/student/attendance/<student_id>", methods=["GET"])
@jwt_required()
def get_attendance(student_id):
    current_user_id = get_jwt_identity()
    if current_user_id != student_id:
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


# ── GET Remarks ──
# React calls: GET /api/student/remarks/S1001
@student_bp.route("/api/student/remarks/<student_id>", methods=["GET"])
@jwt_required()
def get_remarks(student_id):
    current_user_id = get_jwt_identity()
    if current_user_id != student_id:
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


@student_bp.route("/api/student/timetable/<class_name>", methods=["GET"])
@jwt_required()
def get_student_timetable(class_name):

    try:
        rows = Timetable.query.filter_by(class_name=class_name).all()

        timetable = [
            {
                "day": row.day,
                "P1": {"sub": row.p1_subject, "tid": row.p1_teacher},
                "P2": {"sub": row.p2_subject, "tid": row.p2_teacher},
                "P3": {"sub": row.p3_subject, "tid": row.p3_teacher},
                "P4": {"sub": row.p4_subject, "tid": row.p4_teacher},
                "P5": {"sub": row.p5_subject, "tid": row.p5_teacher},
            }
            for row in rows
        ]
        return jsonify({"success": True, "timetable": timetable})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500