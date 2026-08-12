# app.py

from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

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
    app.run(debug=True, port=5000)