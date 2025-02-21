from flask import jsonify, request, Blueprint
from models import db, User
from werkzeug.security import generate_password_hash

user_bp= Blueprint("user_bp", __name__)


# create user
@user_bp.route("/user", methods=["POST"])
def create_user():
    data = request.get_json()

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"msg": "Email already registered"}), 400

    user = User(full_name=data["full_name"], email=data["email"], password=generate_password_hash(data["password"]))
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201

# get all users
@user_bp.route("/user", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([{"id": user.id, "full_name": user.full_name, "email": user.email} for user in users])


# get user by id
@user_bp.route("/user/<int:user_id>", methods=["GET"])
def get_user_by_id(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({"id": user.id, "full_name": user.full_name, "email": user.email})

# update user by id
@user_bp.route("/user/<int:user_id>", methods=["PATCH"])
def update_user_by_id(user_id):
    data = request.get_json()
    user = User.query.get(user_id)

    user.full_name = data["full_name"]
    user.email = data["email"]

    if "password" in data:
        user.password = generate_password_hash(data["password"])

    db.session.commit()

    return jsonify({"id": user.id, "full_name": user.full_name, "email": user.email})

# delete user by id
@user_bp.route("/user/<int:user_id>", methods=["DELETE"])
def delete_user_by_id(user_id):
    user = User.query.get(user_id)
    db.session.delete(user)
    db.session.commit()

    return jsonify({"msg": "User deleted successfully"})
