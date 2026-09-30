from app import app
from extensions import db
from models import ParentChild


with app.app_context():
    db.create_all()

    print("Parent-child table created successfully.")