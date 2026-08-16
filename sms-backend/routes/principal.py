# routes/principal.py

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
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

def require_principal():
    claims = get_jwt()
    return claims.get("role") == "principal".lower()


# ── GET all students ──
@principal_bp.route("/api/principal/students", methods=["GET"])
@jwt_required()
def get_all_students():
    if not require_principal():
        return jsonify({"success": False, "message": "Access denied"}), 403
    try:
        conn   = get_db()
        cursor = conn.cursor()
        # FIXED — was "Student" (capital S), which didn't match how roles
        # are actually stored/checked everywhere else in this project
        cursor.execute("SELECT id FROM users WHERE role=%s", ("student",))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        students = [{"id": row[0]} for row in rows]
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
        conn   = get_db()
        cursor = conn.cursor()
        # FIXED — was "Teacher" (capital T), same casing issue as above
        cursor.execute("SELECT id FROM users WHERE role=%s", ("teacher",))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        teachers = [{"id": row[0]} for row in rows]
        return jsonify({"success": True, "teachers": teachers})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ── GET all marks (principal monitors) ──
@principal_bp.route("/api/principal/marks", methods=["GET"])
@jwt_required()
def get_all_marks():
    if not require_principal():
        return jsonify({"success": False, "message": "Access denied"}), 403
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
@jwt_required()
def get_all_attendance():
    if not require_principal():
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