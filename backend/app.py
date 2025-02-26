from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from models import db, TokenBlocklist
from flask_jwt_extended import JWTManager
from datetime import timedelta
from flask_cors import CORS  
import os

app = Flask(__name__)
CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///donex.db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
migrate = Migrate(app, db)

# JWT Configuration
app.config["JWT_SECRET_KEY"] = "jiyucfvbkaudhudkvfbt" 
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

jwt = JWTManager(app)

# Import views
from views import *

# Register blueprints
app.register_blueprint(user_bp)
app.register_blueprint(charity_bp)
app.register_blueprint(donation_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(auth_bp)

# jwt token
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    """Check if a JWT is revoked."""
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
    return token is not None
