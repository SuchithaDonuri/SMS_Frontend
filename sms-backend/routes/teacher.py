# routes/teacher.py

from flask import Blueprint, request, jsonify
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

# ── GET all marks (teacher views all students marks) ──
@teacher_bp.route("/api/teacher/marks", methods=["GET"])
def get_all_marks():
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
def add_marks():
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
def get_all_attendance():
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
def add_attendance():
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
def get_all_remarks():
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
def add_remark():
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