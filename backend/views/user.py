from flask import jsonify, request, Blueprint
from models import db, User
from werkzeug.security import generate_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity

user_bp= Blueprint("user_bp", __name__)

# create user
@user_bp.route("/register", methods=["POST"])
def create_user():
    data = request.get_json()

    # Validate request payload
    if not data or "email" not in data or "password" not in data or "full_name" not in data:
        return jsonify({"msg": "Invalid request"}), 400
    
    if User.query.filter_by(email=data["email"]).first() is not None:
        return jsonify({"msg":"Email already registered"}), 409
    
    full_name=data["full_name"]
    email=data["email"]
    password=generate_password_hash(data["password"])

    #default role = user 
    role = data.get("admin", "user")
    
    allowed_roles = ["user", "admin"]
    if role not in allowed_roles:
        return jsonify({"msg": "Invalid role. Choose from 'user', 'admin'"}), 400
    if role =="admin" and not User.can_register():
        return jsonify({"msg": "Admin limit reached. Only 3 admins allowed."}), 403
    
    new_user = User(full_name=full_name,email=email,password=password,role=role)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg":"Registered successfully"}), 201


# get all users
@user_bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([{"id": user.id, "full_name": user.full_name, "email": user.email,"profile_picture":user.profile_picture,"role":user.role} for user in users]), 200


# get user by id
@user_bp.route("/users/<int:user_id>", methods=["GET"])
def get_user_by_id(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({"id": user.id, "full_name": user.full_name, "email": user.email,"profile_picture":user.profile_picture,"role":user.role})

# update user by id
@user_bp.route("/user/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user_by_id(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.filter_by(id=current_user_id).first()

    if not current_user:
        return jsonify({"error": "Unauthorized"}), 403
    
    user = User.query.get_or_404(user_id)

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    if "full_name" in data:
        user.full_name = data["full_name"]

    if "email" in data:
        user.email = data["email"]
    
    if "password" in data:
        user.password = generate_password_hash(data["password"])
    
    if "profile_picture" in data:
        user.profile_picture = data["profile_picture"]
    
    if "role" in data:
        user.role = data["role"]
    
    db.session.commit()

    return jsonify({"msg": "User updated successfully"}), 200



# delete user by id
@user_bp.route("/users/delete/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user_by_id(user_id):
    current_user_id = get_jwt_identity()  
    current_user = User.query.filter_by(id=current_user_id).first()

    if not current_user:
        return jsonify({"error": "Unauthorized. User not found"}), 403

    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    #allow only the user or admin to delete account
    if current_user.role != "admin" and current_user.id != user.id:
        return jsonify({"error": "Permission denied"}), 403

    db.session.delete(user)
    db.session.commit()
    
    return jsonify({"msg": "User deleted successfully"}), 200


# ## only admins can delete the 
# @user_bp.route('/users/delete_all', methods=['DELETE'])
# @jwt_required()
# def delete_all_donations():
#     current_user_id =get_jwt_identity()
    
#     if not current_user_id:
#         return jsonify({"error": "Not authorized to delete this donation"}), 403
    
#     User.query.delete()
#     db.session.commit()
#     return jsonify({"message": "All users deleted successfully"}), 200
# GET route to get information about a user

# GET route to retrieve a user's information
@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify({
            'id': user.id,
            'email': user.email,
            'full_name': user.full_name,
            'profile_picture': user.profile_picture,
            'role': user.role
        })
    else:
        return jsonify({'message': 'User not found'}), 404

# PATCH route to update a user's information
@user_bp.route('/users/<int:user_id>', methods=['PATCH'])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    data = request.get_json()

    # Safely update fields if they exist in the request data
    if 'full_name' in data:
        user.full_name = data['full_name']
    if 'email' in data:
        user.email = data['email']
    if 'profile_picture' in data:
        user.profile_picture = data['profile_picture']
    if 'role' in data and data['role'] in ['user', 'admin', 'charity']:
        user.role = data['role']

    try:
        db.session.commit()
        return jsonify({
            'id': user.id,
            'email': user.email,
            'full_name': user.full_name,
            'profile_picture': user.profile_picture,
            'role': user.role
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to update user', 'error': str(e)}), 500