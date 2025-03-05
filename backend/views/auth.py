from flask import jsonify, request, Blueprint, render_template, url_for, redirect
from models import * 
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
from itsdangerous import URLSafeTimedSerializer
from datetime import timedelta
from sqlalchemy_serializer import SerializerMixin
from datetime import timezone
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from app import mail
from flask_mail import Message

serializer = URLSafeTimedSerializer("SECRET_KEY")
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
    
# login with google
@auth_bp.route("/google-login", methods=["POST"])
def login_with_google():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email required"}), 400
    
    user = User.query.filter_by(email=email).first()

    if user:
        access_token = create_access_token(identity=str(user.id))
        return jsonify({"access_token": access_token}), 200
    return jsonify({"error":"Email is incorrect"})
    
    


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
@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    db.session.add(TokenBlocklist(jti=jti, created_at=now))
    db.session.commit()

    return jsonify({"Success": "Logged out successfully"}), 200

# CHARITY AUTHENTICATION 
@auth_bp.route('/charities/login', methods=["POST"])
def charity_login():
    data=request.get_json()
    
    if not data or "email" not in data or "password" not in data:
        return jsonify({"error":"Email and password required"}), 400

    email = data["email"]
    password = data["password"]
    
    # check if charity exist admin
    charity = Charity.query.filter_by(email=email).first()
    
    if charity and check_password_hash(charity.password,password):
        access_token = create_access_token(identity=str(charity.id),expires_delta=timedelta(hours=1))
        print("Generated Token:", access_token)
        return jsonify({"access_token": access_token}), 200
    else:
        return jsonify({"msg":"Invalid email or password"}), 401
    
# Get Current User Info
@auth_bp.route("/current_charities", methods=["GET"])
@jwt_required()
def get_current_charity():
    current_charity = get_jwt_identity()
    charity = Charity.query.get(current_charity)
    
    if not charity:
        return jsonify({"msg": "Charity not found"}), 404

    return jsonify({
        "id": charity.id,
        "email": charity.email,
        "charity_name": charity.charity_name,
    }), 200
    
# Logout a charity (Revoke JWT Token)
@auth_bp.route("/charities/logout", methods=["DELETE"])
@jwt_required()
def charities_logout():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    db.session.add(TokenBlocklist(jti=jti, created_at=now))
    db.session.commit()

    return jsonify({"Success": "Logged out successfully"}), 200
    


# Forgot Password Route
@auth_bp.route('/auth/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required"}), 400

    # Query the user from the database
    user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({"error": "Email not found"}), 404

    # Generate a reset token (for demonstration, use a simple string)
    reset_token = serializer.dumps(email, salt="password-reset-salt")

    # Send the reset link via email
    try:
        msg = Message(
            subject="Password Reset",
            recipients=[email],
            body=f"Click the link to reset your password: http://localhost:5173/reset-password?token={reset_token}",
        )
        mail.send(msg)
        return jsonify({"message": "Reset link sent to your email"}), 200
    except Exception as e:
        print(f"Error sending email: {e}")
        return jsonify({"error": "Failed to send reset link"}), 500


@auth_bp.route('/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('new_password')

    try:
        email = serializer.loads(token, salt="password-reset-salt", max_age=3600)
    except Exception as e:
        return jsonify({"error": "Invalid or expired token"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.password = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({"message": "Password reset successfully"}), 200
