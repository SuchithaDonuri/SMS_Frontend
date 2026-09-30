# models.py
#
# WHY this file? Each class below represents one table that ALREADY
# EXISTS in your PostgreSQL database. This file does not create new
# tables or change any data — it just describes your existing tables
# to SQLAlchemy, so Python code can query them instead of raw SQL.

from extensions import db
from datetime import datetime


class User(db.Model):
    __tablename__ = "users"

    id       = db.Column(db.String(20), primary_key=True)
    password = db.Column(db.String(255), nullable=False)
    role     = db.Column(db.String(20), nullable=False)


class Student(db.Model):
    __tablename__ = "students"

    # WHY primary_key here? This table has no separate "id" column —
    # student_id itself is the unique identifier for each row
    student_id = db.Column(db.String(20), primary_key=True)
    class_name = db.Column(db.String(10))
    section    = db.Column(db.String(5))


class Marks(db.Model):
    __tablename__ = "marks"

    id         = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(20), nullable=False)
    exam_type  = db.Column(db.String(30))
    math       = db.Column(db.Integer)
    physics    = db.Column(db.Integer)
    english    = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Attendance(db.Model):
    __tablename__ = "attendance"

    id         = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(20), nullable=False)
    subject    = db.Column(db.String(50))
    status     = db.Column(db.String(10))
    date       = db.Column(db.Date, default=datetime.utcnow)


class Remarks(db.Model):
    __tablename__ = "remarks"

    id         = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(20), nullable=False)
    remark     = db.Column(db.Text)
    date       = db.Column(db.Date, default=datetime.utcnow)


class Timetable(db.Model):
    __tablename__ = "timetable"

    id         = db.Column(db.Integer, primary_key=True)
    class_name = db.Column(db.String(10), nullable=False)
    day        = db.Column(db.String(20), nullable=False)

    p1_subject = db.Column(db.String(50)); p1_teacher = db.Column(db.String(10))
    p2_subject = db.Column(db.String(50)); p2_teacher = db.Column(db.String(10))
    p3_subject = db.Column(db.String(50)); p3_teacher = db.Column(db.String(10))
    p4_subject = db.Column(db.String(50)); p4_teacher = db.Column(db.String(10))
    p5_subject = db.Column(db.String(50)); p5_teacher = db.Column(db.String(10))

    __table_args__ = (
        db.UniqueConstraint("class_name", "day", name="uq_class_day"),
    )