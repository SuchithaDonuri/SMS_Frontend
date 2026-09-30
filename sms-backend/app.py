# app.py

from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
import os
from extensions import db
from werkzeug.security import generate_password_hash

load_dotenv()

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
CORS(app)
jwt=JWTManager(app)

# NEW — build the database connection string SQLAlchemy will use.
# WHY build it from the same DB_* variables? So we don't need a second,
# separate set of credentials — this reuses exactly what psycopg2 was
# already using in each route file's get_db() function.
app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
)
# WHY False here? Disables a SQLAlchemy feature we don't need
# (tracking every object change for signals) — it uses extra memory
# and Flask-SQLAlchemy's own docs recommend turning it off unless
# you specifically need it
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


db.init_app(app)
def migrate_passwords():
    from models import User

    with app.app_context():
        users = User.query.all()

        for user in users:
            # Skip passwords that are already hashed.
            if user.password.startswith(("scrypt:", "pbkdf2:", "argon2:")):
                continue

            print(f"Hashing password for user: {user.id}")

            user.password = generate_password_hash(user.password)

        db.session.commit()

        print("Password migration completed successfully.")


# WHY import after app creation?
# Avoids circular import errors
from routes.auth      import auth_bp
from routes.student   import student_bp
from routes.teacher   import teacher_bp
from routes.principal import principal_bp
from routes.parent    import parent_bp

app.register_blueprint(auth_bp)
app.register_blueprint(student_bp)
app.register_blueprint(teacher_bp)
app.register_blueprint(principal_bp)
app.register_blueprint(parent_bp)

@app.route("/api/test")
def test():
    return jsonify({"message": "Flask is working!"})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)