# routes/teacher.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
import psycopg2
import os

teacher_bp = Blueprint("teacher", __name__)

def get_db():
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        port=os.getenv("DB_PORT")
    )
    return conn

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
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, student_id, exam_type, math, physics, english, created_at FROM marks"
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        marks = [
            {
                "id":         row[0],
                "student_id": row[1],
                "exam_type":  row[2],
                "math":       row[3],
                "physics":    row[4],
                "english":    row[5],
                "created_at": str(row[6])
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
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO marks (student_id, exam_type, math, physics, english) VALUES (%s, %s, %s, %s, %s)",
            (
                data.get("student_id"),
                data.get("exam_type"),
                data.get("math"),
                data.get("physics"),
                data.get("english")
            )
        )
        conn.commit()
        cursor.close()
        conn.close()
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
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, student_id, subject, status, date FROM attendance"
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        attendance = [
            {
                "id":         row[0],
                "student_id": row[1],
                "subject":    row[2],
                "status":     row[3],
                "date":       str(row[4])
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
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO attendance (student_id, subject, status) VALUES (%s, %s, %s)",
            (
                data.get("student_id"),
                data.get("subject"),
                data.get("status")
            )
        )
        conn.commit()
        cursor.close()
        conn.close()
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
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, student_id, remark, date FROM remarks"
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        remarks = [
            {
                "id":         row[0],
                "student_id": row[1],
                "remark":     row[2],
                "date":       str(row[3])
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
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO remarks (student_id, remark) VALUES (%s, %s)",
            (data.get("student_id"), data.get("remark"))
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"success": True, "message": "Remark saved!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@teacher_bp.route("/api/teacher/timetable/<class_name>", methods=["GET"])
@jwt_required()
def get_timetable(class_name):
    if not require_teacher_or_principal():
        return jsonify({"success": False, "message": "Access denied"}), 403
    try:
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT day, p1_subject, p1_teacher, p2_subject, p2_teacher, "
            "p3_subject, p3_teacher, p4_subject, p4_teacher, p5_subject, p5_teacher "
            "FROM timetable WHERE class_name=%s "
            "ORDER BY CASE day "
            "WHEN 'Monday' THEN 1 WHEN 'Tuesday' THEN 2 WHEN 'Wednesday' THEN 3 "
            "WHEN 'Thursday' THEN 4 WHEN 'Friday' THEN 5 WHEN 'Saturday' THEN 6 END",
            (class_name,)
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        timetable = [
            {
                "day": row[0],
                "P1": {"sub": row[1], "tid": row[2]},
                "P2": {"sub": row[3], "tid": row[4]},
                "P3": {"sub": row[5], "tid": row[6]},
                "P4": {"sub": row[7], "tid": row[8]},
                "P5": {"sub": row[9], "tid": row[10]},
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
        conn   = get_db()
        cursor = conn.cursor()
        # WHY ON CONFLICT? If this (class_name, day) already exists, UPDATE it.
        # If it doesn't exist yet, INSERT it. One statement handles both cases —
        # this only works because of the UNIQUE constraint we created earlier.
        cursor.execute(
            """
            INSERT INTO timetable
                (class_name, day, p1_subject, p1_teacher, p2_subject, p2_teacher,
                 p3_subject, p3_teacher, p4_subject, p4_teacher, p5_subject, p5_teacher)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (class_name, day) DO UPDATE SET
                p1_subject=EXCLUDED.p1_subject, p1_teacher=EXCLUDED.p1_teacher,
                p2_subject=EXCLUDED.p2_subject, p2_teacher=EXCLUDED.p2_teacher,
                p3_subject=EXCLUDED.p3_subject, p3_teacher=EXCLUDED.p3_teacher,
                p4_subject=EXCLUDED.p4_subject, p4_teacher=EXCLUDED.p4_teacher,
                p5_subject=EXCLUDED.p5_subject, p5_teacher=EXCLUDED.p5_teacher
            """,
            (
                data.get("class_name"), data.get("day"),
                data["P1"]["sub"], data["P1"]["tid"],
                data["P2"]["sub"], data["P2"]["tid"],
                data["P3"]["sub"], data["P3"]["tid"],
                data["P4"]["sub"], data["P4"]["tid"],
                data["P5"]["sub"], data["P5"]["tid"],
            )
        )
        conn.commit()
        cursor.close()
        conn.close()
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
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "DELETE FROM timetable WHERE class_name=%s AND day=%s",
            (class_name, day)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"success": True, "message": "Row deleted!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    
def require_teacher_or_principal():
    role = get_jwt().get("role", "").lower()
    return role in ("teacher", "principal")