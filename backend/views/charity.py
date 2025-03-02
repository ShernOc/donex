from flask import jsonify, request, Blueprint
from models import db, Charity, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash

charity_bp = Blueprint("charity_bp", __name__)

# Populate the database with sample charities
@charity_bp.route('/charities/populate', methods=['POST'])
def populate_charities():
    for charity in sample_charities:
        existing_charity = Charity.query.filter_by(charity_name=charity["charity_name"]).first()
        if not existing_charity:
            new_charity = Charity(
                charity_name=charity["charity_name"],
                email=charity["email"],
                password=charity["password"],
                user_id=None
            )
            db.session.add(new_charity)
    db.session.commit()
    return jsonify({"success": "Sample charities added successfully"}), 200

# Post a charity
@charity_bp.route('/charities', methods=["POST"])
def post_charity():
    data = request.get_json()
    charity_name = data.get("charity_name")
    password = generate_password_hash(data.get("password"))
    email = data.get("email")

    if not charity_name or not password or not email:
        return jsonify({"error": "Missing required fields"}), 400

    existing_charity = Charity.query.filter_by(charity_name=charity_name).first()
    if existing_charity:
        return jsonify({"error": "Charity already exists"}), 406

    new_charity = Charity(charity_name=charity_name, email=email, password=password, user_id=None)
    db.session.add(new_charity)
    db.session.commit()
    return jsonify({"success": "Charity added successfully", "charity_id": new_charity.id}), 200

# Get all charities
@charity_bp.route('/charities', methods=['GET'])
@jwt_required()
def get_charities():
    charities = Charity.query.all()
    return jsonify({
        "charities": [{
            "id": charity.id,
            "charity_name": charity.charity_name,
            "email": charity.email,
            "user_id": charity.user_id
        } for charity in charities]
    }), 200

# Get a charity by ID
@charity_bp.route('/charities/<int:charity_id>', methods=['GET'])
@jwt_required()
def get_charity_by_id(charity_id):
    charity = Charity.query.get(charity_id)
    if not charity:
        return jsonify({"error": "Charity not found"}), 404
    return jsonify({
        "id": charity.id,
        "charity_name": charity.charity_name,
        "email": charity.email,
        "user_id": charity.user_id
    }), 200

# Update a charity
@charity_bp.route('/charities/update/<int:charity_id>', methods=["PATCH"])
@jwt_required()
def update_charity(charity_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    charity = Charity.query.get(charity_id)
    
    if not charity:
        return jsonify({"error": "Charity not found"}), 404
    
    if not user or (user.role != "admin" and charity.user_id != current_user_id):
        return jsonify({"error": "Unauthorized to update the charity"}), 403

    data = request.get_json()
    if "charity_name" in data:
        existing = Charity.query.filter(Charity.charity_name == data["charity_name"], Charity.id != charity.id).first()
        if existing:
            return jsonify({"error": "Another charity with that name already exists"}), 409
        charity.charity_name = data["charity_name"]
    
    if "email" in data:
        charity.email = data["email"]
    
    if "description" in data:
        charity.description = data["description"]

    if "password" in data:
        charity.password = generate_password_hash(data["password"])

    db.session.commit()
    return jsonify({"success": "Charity updated successfully"}), 200

# Delete a charity
@charity_bp.route('/charities/delete/<int:charity_id>', methods=['DELETE'])
@jwt_required()
def delete_charity(charity_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    charity = Charity.query.get(charity_id)
    
    if not charity:
        return jsonify({"error": "Charity not found"}), 404
    
    if not user or (user.role != "admin" and charity.user_id != current_user_id):
        return jsonify({"error": "Unauthorized to delete the charity"}), 403
    
    db.session.delete(charity)
    db.session.commit()
    return jsonify({"success": "Charity deleted successfully"}), 200
