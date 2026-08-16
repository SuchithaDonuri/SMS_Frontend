# routes/student.py

# WHY student_bp? All student routes grouped in one blueprint
from flask import Blueprint, request, jsonify
import psycopg2
import os
from flask_jwt_extended import jwt_required,get_jwt_identity
student_bp = Blueprint("student", __name__)

def get_db():
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        port=os.getenv("DB_PORT")
    )
    return conn

# ── GET Marks ──
# React calls: GET /api/student/marks/S1001

@student_bp.route("/api/student/marks/<student_id>", methods=["GET"])
@jwt_required()
def get_marks(student_id):
    
    current_user_id=get_jwt_identity()
    if current_user_id != student_id:
        return jsonify({"success": False, "message": "Access denied"}), 403
    
    try:
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, exam_type, math, physics, english, created_at FROM marks WHERE student_id=%s",
            (student_id,)
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        marks = [
            {
                "id":         row[0],
                "exam_type":  row[1],
                "math":       row[2],
                "physics":    row[3],
                "english":    row[4],
                "created_at": str(row[5])
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
    current_user_id=get_jwt_identity()
    if current_user_id != student_id:
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

# ── GET Remarks ──
# React calls: GET /api/student/remarks/S1001

@student_bp.route("/api/student/remarks/<student_id>", methods=["GET"])
@jwt_required()
def get_remarks(student_id):
    current_user_id=get_jwt_identity()
    if current_user_id != student_id:
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
    
@student_bp.route("/api/student/timetable/<class_name>", methods=["GET"])
@jwt_required()
def get_student_timetable(class_name):
    
    try:
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT day, p1_subject, p1_teacher, p2_subject, p2_teacher, "
            "p3_subject, p3_teacher, p4_subject, p4_teacher, p5_subject, p5_teacher "
            "FROM timetable WHERE class_name=%s",
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