from flask import Flask, jsonify, request
from flask_migrate import Migrate
from models import db, TokenBlocklist
from flask_jwt_extended import JWTManager
from datetime import timedelta
from flask_cors import CORS


app = Flask(__name__)
CORS(app) 
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///donex.db'
migrate = Migrate(app, db)

db.init_app(app)


app.config["JWT_SECRET_KEY"] = "jiyucfvbkaudhudkvfbt" 
app.config["JWT_ACCESS_TOKEN_EXPIRES"] =  timedelta(hours=1)

jwt = JWTManager(app)
jwt.init_app(app)


# import all functions in views
from views import *


app.register_blueprint(user_bp)
app.register_blueprint(charity_bp)
app.register_blueprint(donation_bp)
app.register_blueprint(admin_bp)


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()

    return token is not None