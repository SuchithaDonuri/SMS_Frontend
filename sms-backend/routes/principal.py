# routes/principal.py

from flask import Blueprint, request, jsonify
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
        cursor.execute("SELECT id FROM users WHERE role=%s", ("teacher",))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        teachers = [{"id": row[0]} for row in rows]
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


# ── GET all attendance ──
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


# ── NEW: GET students filtered by class + section ──
@principal_bp.route("/api/principal/students/<class_name>/<section>", methods=["GET"])
@jwt_required()
def get_students_by_class(class_name, section):
    if not require_principal():
        return jsonify({"success": False, "message": "Access denied"}), 403
    try:
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT student_id FROM students WHERE class_name=%s AND section=%s",
            (class_name, section)
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        students = [{"id": row[0]} for row in rows]
        return jsonify({"success": True, "students": students})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ── NEW: GET marks for students in a specific class + section ──
@principal_bp.route("/api/principal/marks/<class_name>/<section>", methods=["GET"])
@jwt_required()
def get_marks_by_class(class_name, section):
    if not require_principal():
        return jsonify({"success": False, "message": "Access denied"}), 403
    try:
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT marks.student_id, marks.exam_type, marks.math, marks.physics, marks.english
            FROM marks
            JOIN students ON marks.student_id = students.student_id
            WHERE students.class_name = %s AND students.section = %s
            """,
            (class_name, section)
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        marks = [
            {
                "student_id": row[0],
                "exam_type":  row[1],
                "math":       row[2],
                "physics":    row[3],
                "english":    row[4]
            }
            for row in rows
        ]
        return jsonify({"success": True, "marks": marks})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ── NEW: GET attendance for students in a specific class + section ──
@principal_bp.route("/api/principal/attendance/<class_name>/<section>", methods=["GET"])
@jwt_required()
def get_attendance_by_class(class_name, section):
    if not require_principal():
        return jsonify({"success": False, "message": "Access denied"}), 403
    try:
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT attendance.student_id, attendance.subject, attendance.status, attendance.date
            FROM attendance
            JOIN students ON attendance.student_id = students.student_id
            WHERE students.class_name = %s AND students.section = %s
            """,
            (class_name, section)
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        attendance = [
            {
                "student_id": row[0],
                "subject":    row[1],
                "status":     row[2],
                "date":       str(row[3])
            }
            for row in rows
        ]
        return jsonify({"success": True, "attendance": attendance})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ── NEW: GET remarks for students in a specific class + section ──
@principal_bp.route("/api/principal/remarks/<class_name>/<section>", methods=["GET"])
@jwt_required()
def get_remarks_by_class(class_name, section):
    if not require_principal():
        return jsonify({"success": False, "message": "Access denied"}), 403
    try:
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT remarks.student_id, remarks.remark, remarks.date
            FROM remarks
            JOIN students ON remarks.student_id = students.student_id
            WHERE students.class_name = %s AND students.section = %s
            """,
            (class_name, section)
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        remarks = [
            {
                "student_id": row[0],
                "remark":     row[1],
                "date":       str(row[2])
            }
            for row in rows
        ]
        return jsonify({"success": True, "remarks": remarks})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500