from flask import jsonify, request, Blueprint, render_template, url_for, redirect
from models import *
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
from datetime import timedelta
from datetime import timezone
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    
    if not data or "email" not in data or "password" not in data:
        return jsonify({"error":"Email and password required"}), 400

    email = data["email"]
    password = data["password"]
    
    # check if user exist admin
    user = User.query.filter_by(email=email).first()
    
    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=str(user.id),expires_delta=timedelta(hours=1))
        print("Generated Token:", access_token)
        return jsonify({"access_token": access_token}), 200
    else:

        return jsonify({"msg":"Invalid email or password"}), 401
    
    
# Get Current User Info
@auth_bp.route("/current_user", methods=["GET"])
@jwt_required()
def get_current_user():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role
    }), 200

# Logout (Revoke JWT Token)
@auth_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    db.session.add(TokenBlocklist(jti=jti, created_at=now))
    db.session.commit()

    return jsonify({"Success": "Logged out successfully"}), 200