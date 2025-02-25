from flask import jsonify, request, Blueprint, render_template, url_for, redirect
from models import db, User, TokenBlocklist

from models import *
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
from datetime import timedelta
from datetime import timezone
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt


auth_bp = Blueprint("auth_bp", __name__)



# Email/Password Login


# from app import oauth, app

auth_bp = Blueprint("auth_bp", __name__)

# # OAuth Configuration (No need to re-register here, since already done in `app.py`)
# google = oauth.google
# github = oauth.github


# # Google OAuth Login
# @auth_bp.route("/login/google")
# def google_login():
#     redirect_uri = url_for("auth_bp.google_authorize", _external=True)
#     return google.authorize_redirect(redirect_uri)


# Google OAuth Callback
# @auth_bp.route("/login/google/authorize")
# def google_authorize():
#     try:
#         token = google.authorize_access_token()
#         resp = google.get("userinfo").json()

#         email = resp.get("email")
#         if not email:
#             return jsonify({"error": "Google login failed: Email not found"}), 400

#         # Fetch or create user
#         user = User.query.filter_by(email=email).first()
#         if not user:
#             user = User(full_name=resp.get("name"), email=email)
#             db.session.add(user)
#             db.session.commit()

#         # Generate JWT access token
#         access_token = create_access_token(identity=user.id)
#         return jsonify({"access_token": access_token}), 200

#     except Exception as e:
#         print(f"Google OAuth Error: {e}")
#         return jsonify({"error": "Google login failed"}), 500


# # GitHub OAuth Login
# @auth_bp.route("/login/github")
# def github_login():
#     redirect_uri = url_for("auth_bp.github_authorize", _external=True)
#     return github.authorize_redirect(redirect_uri)


# # GitHub OAuth Callback
# @auth_bp.route("/login/github/authorize")
# def github_authorize():
#     try:
#         token = github.authorize_access_token()
#         resp = github.get("user").json()

#         email = resp.get("email")
#         if not email:
#             return jsonify({"error": "GitHub login failed: Email not found"}), 400

        # Fetch or create user
        # user = User.query.filter_by(email=email).first()
        # if not user:
        #     user = User(full_name=resp.get("name"), email=email)
        #     db.session.add(user)
        #     db.session.commit()

        # Generate JWT access token
        # access_token = create_access_token(identity=user.id)
        # return jsonify({"access_token": access_token}), 200

    # except Exception as e:
        # print(f"GitHub OAuth Error: {e}")
        # return jsonify({"error": "GitHub login failed"}), 500


# Email/Password Login/ both User and Admin

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data or "email" not in data or "password" not in data:

        return jsonify({"error": "Email and password required"}), 400

    email = data["email"]
    password = data["password"]

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify({"access_token": access_token}), 200

    return jsonify({"msg":"Invalid email or password"}), 401
    


# Get Current User Info
@auth_bp.route("/user", methods=["GET"])
@jwt_required()
def get_user():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
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