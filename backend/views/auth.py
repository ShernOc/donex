from flask import jsonify, request, Blueprint
from models import db, User, TokenBlocklist
from models import *
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
from datetime import timedelta
from datetime import timezone
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt

auth_bp= Blueprint("auth_bp", __name__)

# login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()

    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"msg": "Invalid email or password"}), 401

    access_token = create_access_token(identity=user.id, expires_delta=timedelta(minutes=15))
    return jsonify({"access_token": access_token}), 200

# register
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"msg": "Email already registered"}), 400

    user = User(full_name=data["full_name"], email=data["email"], 
    password=generate_password_hash(data["password"]))
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=user.id, expires_delta=timedelta(minutes=15))
    return jsonify({"access_token": access_token}), 200


# current user
@auth_bp.route("/user", methods=["GET"])
@jwt_required()
def get_user():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    return jsonify({"id": user.id, "email": user.email, "full_name": user.full_name}), 200

# logout
@auth_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    db.session.add(TokenBlocklist(jti=jti, created_at=now))
    db.session.commit()
    return jsonify({"success":"Logged out successfully"})

