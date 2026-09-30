from flask import Blueprint, request, jsonify

from decorators import role_required
from extensions import db
from models import Marks, Attendance, Remarks, Timetable


teacher_bp = Blueprint("teacher", __name__)


# ============================================================
# MARKS
# ============================================================

# GET all marks
@teacher_bp.route("/api/teacher/marks", methods=["GET"])
@role_required("teacher")
def get_all_marks():
    try:
        rows = Marks.query.all()

        marks = [
            {
                "id": row.id,
                "student_id": row.student_id,
                "exam_type": row.exam_type,
                "math": row.math,
                "physics": row.physics,
                "english": row.english,
                "created_at": str(row.created_at),
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


# POST marks
@teacher_bp.route("/api/teacher/marks", methods=["POST"])
@role_required("teacher")
def add_marks():
    data = request.get_json(silent=True) or {}

    # Basic validation
    required_fields = [
        "student_id",
        "exam_type",
        "math",
        "physics",
        "english"
    ]

    missing_fields = [
        field for field in required_fields
        if data.get(field) is None
    ]

    if missing_fields:
        return jsonify({
            "success": False,
            "message": "Missing required fields",
            "fields": missing_fields
        }), 400

    try:
        new_marks = Marks(
            student_id=data.get("student_id"),
            exam_type=data.get("exam_type"),
            math=data.get("math"),
            physics=data.get("physics"),
            english=data.get("english"),
        )

        db.session.add(new_marks)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Marks saved!"
        }), 201

    except Exception:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Unable to save marks"
        }), 500


# ============================================================
# ATTENDANCE
# ============================================================

# GET all attendance
@teacher_bp.route("/api/teacher/attendance", methods=["GET"])
@role_required("teacher")
def get_all_attendance():
    try:
        rows = Attendance.query.all()

        attendance = [
            {
                "id": row.id,
                "student_id": row.student_id,
                "subject": row.subject,
                "status": row.status,
                "date": str(row.date),
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


# POST attendance
@teacher_bp.route("/api/teacher/attendance", methods=["POST"])
@role_required("teacher")
def add_attendance():
    data = request.get_json(silent=True) or {}

    required_fields = [
        "student_id",
        "subject",
        "status"
    ]

    missing_fields = [
        field for field in required_fields
        if not data.get(field)
    ]

    if missing_fields:
        return jsonify({
            "success": False,
            "message": "Missing required fields",
            "fields": missing_fields
        }), 400

    try:
        new_attendance = Attendance(
            student_id=data.get("student_id"),
            subject=data.get("subject"),
            status=data.get("status"),
        )

        db.session.add(new_attendance)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Attendance marked!"
        }), 201

    except Exception:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Unable to save attendance"
        }), 500


# ============================================================
# REMARKS
# ============================================================

# GET all remarks
@teacher_bp.route("/api/teacher/remarks", methods=["GET"])
@role_required("teacher")
def get_all_remarks():
    try:
        rows = Remarks.query.all()

        remarks = [
            {
                "id": row.id,
                "student_id": row.student_id,
                "remark": row.remark,
                "date": str(row.date),
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


# POST remark
@teacher_bp.route("/api/teacher/remarks", methods=["POST"])
@role_required("teacher")
def add_remark():
    data = request.get_json(silent=True) or {}

    required_fields = [
        "student_id",
        "remark"
    ]

    missing_fields = [
        field for field in required_fields
        if not data.get(field)
    ]

    if missing_fields:
        return jsonify({
            "success": False,
            "message": "Missing required fields",
            "fields": missing_fields
        }), 400

    try:
        new_remark = Remarks(
            student_id=data.get("student_id"),
            remark=data.get("remark"),
        )

        db.session.add(new_remark)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Remark saved!"
        }), 201

    except Exception:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Unable to save remark"
        }), 500


# ============================================================
# TIMETABLE
# ============================================================

# GET timetable
# Teachers and principals are allowed to view timetables.
@teacher_bp.route(
    "/api/teacher/timetable/<class_name>",
    methods=["GET"]
)
@role_required("teacher", "principal")
def get_timetable(class_name):
    try:
        rows = Timetable.query.filter_by(
            class_name=class_name
        ).all()

        day_order = {
            "Monday": 1,
            "Tuesday": 2,
            "Wednesday": 3,
            "Thursday": 4,
            "Friday": 5,
            "Saturday": 6,
        }

        rows.sort(
            key=lambda row: day_order.get(row.day, 99)
        )

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
                },
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


# POST / update timetable
@teacher_bp.route(
    "/api/teacher/timetable",
    methods=["POST"]
)
@role_required("teacher")
def save_timetable_day():
    data = request.get_json(silent=True) or {}

    if not data.get("class_name") or not data.get("day"):
        return jsonify({
            "success": False,
            "message": "class_name and day are required"
        }), 400

    required_periods = [
        "P1",
        "P2",
        "P3",
        "P4",
        "P5"
    ]

    for period in required_periods:
        if period not in data:
            return jsonify({
                "success": False,
                "message": f"{period} is required"
            }), 400

        if not isinstance(data[period], dict):
            return jsonify({
                "success": False,
                "message": f"{period} must be an object"
            }), 400

        if "sub" not in data[period] or "tid" not in data[period]:
            return jsonify({
                "success": False,
                "message": (
                    f"{period} must contain "
                    "'sub' and 'tid'"
                )
            }), 400

    try:
        existing = Timetable.query.filter_by(
            class_name=data.get("class_name"),
            day=data.get("day")
        ).first()

        if existing:
            existing.p1_subject = data["P1"]["sub"]
            existing.p1_teacher = data["P1"]["tid"]

            existing.p2_subject = data["P2"]["sub"]
            existing.p2_teacher = data["P2"]["tid"]

            existing.p3_subject = data["P3"]["sub"]
            existing.p3_teacher = data["P3"]["tid"]

            existing.p4_subject = data["P4"]["sub"]
            existing.p4_teacher = data["P4"]["tid"]

            existing.p5_subject = data["P5"]["sub"]
            existing.p5_teacher = data["P5"]["tid"]

        else:
            existing = Timetable(
                class_name=data.get("class_name"),
                day=data.get("day"),

                p1_subject=data["P1"]["sub"],
                p1_teacher=data["P1"]["tid"],

                p2_subject=data["P2"]["sub"],
                p2_teacher=data["P2"]["tid"],

                p3_subject=data["P3"]["sub"],
                p3_teacher=data["P3"]["tid"],

                p4_subject=data["P4"]["sub"],
                p4_teacher=data["P4"]["tid"],

                p5_subject=data["P5"]["sub"],
                p5_teacher=data["P5"]["tid"],
            )

            db.session.add(existing)

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Timetable saved!"
        }), 200

    except Exception:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Unable to save timetable"
        }), 500


# DELETE timetable row
@teacher_bp.route(
    "/api/teacher/timetable/<class_name>/<day>",
    methods=["DELETE"]
)
@role_required("teacher")
def delete_timetable_day(class_name, day):
    try:
        row = Timetable.query.filter_by(
            class_name=class_name,
            day=day
        ).first()

        if not row:
            return jsonify({
                "success": False,
                "message": "Timetable row not found"
            }), 404

        db.session.delete(row)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Row deleted!"
        }), 200

    except Exception:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Unable to delete timetable row"
        }), 500