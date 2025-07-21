from flask import Flask
from controllers import register_blueprints
from models import db, csrf, login_manager
import os
from dotenv import load_dotenv
from models.model import auto_admin

def create_app():

    load_dotenv()
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv("FLASK_SECRET_KEY")

    db.init_app(app)
    csrf.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = "auth.login"
    register_blueprints(app)

    email = os.getenv("ADMIN_EMAIL")
    password = os.getenv("ADMIN_PASSWORD")
    with app.app_context():
        db.create_all()
        auto_admin(app, email, password)

    return app

from app import create_app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)