# routes/teacher.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from extensions import db
from models import Marks, Attendance, Remarks, Timetable

teacher_bp = Blueprint("teacher", __name__)

# WHY this helper? Every teacher route needs the same check —
# "does this token belong to a teacher?" — so we write it once here
# instead of repeating the same two lines in every single function below.
def require_teacher():
    claims = get_jwt()
    return claims.get("role").lower() == "teacher"


# ── GET all marks (teacher views all students marks) ──
@teacher_bp.route("/api/teacher/marks", methods=["GET"])
@jwt_required()
def get_all_marks():
    if not require_teacher():
        return jsonify({"success": False, "message": "Access denied"}), 403
    try:
        # WHY .all() with no filter_by()? Raw SQL had no WHERE clause either —
        # this fetches every row in the table, same as before
        rows = Marks.query.all()
        marks = [
            {
                "id":         row.id,
                "student_id": row.student_id,
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


# ── POST marks (teacher submits marks) ──
@teacher_bp.route("/api/teacher/marks", methods=["POST"])
@jwt_required()
def add_marks():
    if not require_teacher():
        return jsonify({"success": False, "message": "Access denied"}), 403
    data = request.get_json()
    try:
        # WHY create a Marks(...) object? This is the ORM equivalent of
        # INSERT INTO marks (...) VALUES (...) — you build the new row as
        # a Python object first, matching each column to a value
        new_marks = Marks(
            student_id = data.get("student_id"),
            exam_type  = data.get("exam_type"),
            math       = data.get("math"),
            physics    = data.get("physics"),
            english    = data.get("english"),
        )
        # WHY db.session.add()? "Stages" the new row — like putting an
        # item in a shopping cart, not yet saved for real
        db.session.add(new_marks)
        # WHY db.session.commit()? Actually saves it to PostgreSQL —
        # same job as conn.commit() did in the raw SQL version
        db.session.commit()
        return jsonify({"success": True, "message": "Marks saved!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ── GET all attendance ──
@teacher_bp.route("/api/teacher/attendance", methods=["GET"])
@jwt_required()
def get_all_attendance():
    if not require_teacher():
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


# ── POST attendance ──
@teacher_bp.route("/api/teacher/attendance", methods=["POST"])
@jwt_required()
def add_attendance():
    if not require_teacher():
        return jsonify({"success": False, "message": "Access denied"}), 403
    data = request.get_json()
    try:
        new_attendance = Attendance(
            student_id = data.get("student_id"),
            subject    = data.get("subject"),
            status     = data.get("status"),
        )
        db.session.add(new_attendance)
        db.session.commit()
        return jsonify({"success": True, "message": "Attendance marked!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ── GET all remarks ──
@teacher_bp.route("/api/teacher/remarks", methods=["GET"])
@jwt_required()
def get_all_remarks():
    if not require_teacher():
        return jsonify({"success": False, "message": "Access denied"}), 403
    try:
        rows = Remarks.query.all()
        remarks = [
            {
                "id":         row.id,
                "student_id": row.student_id,
                "remark":     row.remark,
                "date":       str(row.date)
            }
            for row in rows
        ]
        return jsonify({"success": True, "remarks": remarks})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ── POST remarks ──
@teacher_bp.route("/api/teacher/remarks", methods=["POST"])
@jwt_required()
def add_remark():
    if not require_teacher():
        return jsonify({"success": False, "message": "Access denied"}), 403
    data = request.get_json()
    try:
        new_remark = Remarks(
            student_id = data.get("student_id"),
            remark     = data.get("remark"),
        )
        db.session.add(new_remark)
        db.session.commit()
        return jsonify({"success": True, "message": "Remark saved!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@teacher_bp.route("/api/teacher/timetable/<class_name>", methods=["GET"])
@jwt_required()
def get_timetable(class_name):
    if not require_teacher_or_principal():
        return jsonify({"success": False, "message": "Access denied"}), 403
    try:
        rows = Timetable.query.filter_by(class_name=class_name).all()

        # WHY sort here instead of in the query? Your raw SQL used
        # ORDER BY CASE day WHEN 'Monday' THEN 1... to sort weekdays
        # correctly. Rather than rebuilding that CASE logic in SQLAlchemy,
        # we fetch the (small) list of rows and sort them in plain Python —
        # same end result, easier to read.
        day_order = {"Monday": 1, "Tuesday": 2, "Wednesday": 3,
                     "Thursday": 4, "Friday": 5, "Saturday": 6}
        rows.sort(key=lambda r: day_order.get(r.day, 99))

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


# ── SAVE (update) one day's timetable row ──
@teacher_bp.route("/api/teacher/timetable", methods=["POST"])
@jwt_required()
def save_timetable_day():
    if not require_teacher():
        return jsonify({"success": False, "message": "Access denied"}), 403
    data = request.get_json()
    try:
        # WHY this replaces ON CONFLICT DO UPDATE? SQLAlchemy doesn't have
        # a single built-in "upsert" shortcut like PostgreSQL's ON CONFLICT,
        # so we do it in two clear steps instead:
        # 1) check if a row for this class+day already exists
        existing = Timetable.query.filter_by(
            class_name=data.get("class_name"),
            day=data.get("day")
        ).first()

        if existing:
            # 2a) if it exists, update its fields in place
            existing.p1_subject, existing.p1_teacher = data["P1"]["sub"], data["P1"]["tid"]
            existing.p2_subject, existing.p2_teacher = data["P2"]["sub"], data["P2"]["tid"]
            existing.p3_subject, existing.p3_teacher = data["P3"]["sub"], data["P3"]["tid"]
            existing.p4_subject, existing.p4_teacher = data["P4"]["sub"], data["P4"]["tid"]
            existing.p5_subject, existing.p5_teacher = data["P5"]["sub"], data["P5"]["tid"]
        else:
            # 2b) if it doesn't exist, create a brand new row
            existing = Timetable(
                class_name = data.get("class_name"),
                day        = data.get("day"),
                p1_subject = data["P1"]["sub"], p1_teacher = data["P1"]["tid"],
                p2_subject = data["P2"]["sub"], p2_teacher = data["P2"]["tid"],
                p3_subject = data["P3"]["sub"], p3_teacher = data["P3"]["tid"],
                p4_subject = data["P4"]["sub"], p4_teacher = data["P4"]["tid"],
                p5_subject = data["P5"]["sub"], p5_teacher = data["P5"]["tid"],
            )
            db.session.add(existing)

        # WHY one commit here for both cases? Whether we changed an
        # existing object's attributes OR added a brand new one,
        # commit() is what actually writes it to PostgreSQL
        db.session.commit()
        return jsonify({"success": True, "message": "Timetable saved!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ── DELETE one day's timetable row ──
@teacher_bp.route("/api/teacher/timetable/<class_name>/<day>", methods=["DELETE"])
@jwt_required()
def delete_timetable_day(class_name, day):
    if not require_teacher():
        return jsonify({"success": False, "message": "Access denied"}), 403
    try:
        row = Timetable.query.filter_by(class_name=class_name, day=day).first()
        if row:
            # WHY db.session.delete()? The ORM way of removing a row —
            # equivalent to DELETE FROM timetable WHERE class_name=%s AND day=%s
            db.session.delete(row)
            db.session.commit()
        # WHY still return success if row is None? Matches the raw SQL
        # behavior — DELETE with no matching row doesn't error, it just
        # affects zero rows silently. Same here.
        return jsonify({"success": True, "message": "Row deleted!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


def require_teacher_or_principal():
    role = get_jwt().get("role", "").lower()
    return role in ("teacher", "principal")