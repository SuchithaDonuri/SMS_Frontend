# routes/principal.py

from flask import Blueprint, jsonify
import psycopg2
import os

principal_bp = Blueprint("principal", __name__)

def get_db():
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        port=os.getenv("DB_PORT")
    )
    return conn

# ── GET all students ──
@principal_bp.route("/api/principal/students", methods=["GET"])
def get_all_students():
    try:
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE role=%s", ("Student",))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        students = [{"id": row[0]} for row in rows]
        return jsonify({"success": True, "students": students})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# ── GET all teachers ──
@principal_bp.route("/api/principal/teachers", methods=["GET"])
def get_all_teachers():
    try:
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE role=%s", ("Teacher",))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        teachers = [{"id": row[0]} for row in rows]
        return jsonify({"success": True, "teachers": teachers})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# ── GET all marks (principal monitors) ──
@principal_bp.route("/api/principal/marks", methods=["GET"])
def get_all_marks():
    try:
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, student_id, exam_type, math, physics, english FROM marks"
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
                "english":    row[5]
            }
            for row in rows
        ]
        return jsonify({"success": True, "marks": marks})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# ── GET all attendance (principal monitors) ──
@principal_bp.route("/api/principal/attendance", methods=["GET"])
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