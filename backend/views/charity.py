from flask import jsonify, request, Blueprint
from models import db, Charity
from flask_jwt_extended import jwt_required, get_jwt_identity

charity_bp = Blueprint("charity_bp", __name__)

# Get all charities
@charity_bp.route('/charities', methods=['GET'])
@jwt_required()
def get_charities():
    # Get all charities regardless of the current user.
    charities = Charity.query.all()
    charity_list = []
    for charity in charities:
        charity_list.append({
            "id": charity.id,
            "charity_name": charity.charity_name,
            "email": charity.email
        })
    return jsonify({"charities": charity_list}), 200

# Get a charity by id
@charity_bp.route('/charities/<int:charity_id>', methods=['GET'])
@jwt_required()
def get_charity_by_id(charity_id):
    charity = Charity.query.get(charity_id)
    if not charity:
        return jsonify({"error": "Charity not found"}), 404
    return jsonify({
        "id": charity.id,
        "charity_name": charity.charity_name,
        "email": charity.email
    }), 200

# Post a charity
@charity_bp.route('/charity', methods=["POST"])
@jwt_required()
def post_charity():
    data = request.get_json()
    charity_name = data.get("charity_name")
    password = data.get("password")
    email = data.get("email")
    
    # Validate required fields
    if not charity_name or not password or not email:
        return jsonify({"error": "Missing required fields"}), 400

    # Check if a charity with this charity_name already exists
    existing_charity = Charity.query.filter_by(charity_name=charity_name).first()
    if existing_charity:
        return jsonify({"error": "Charity already exists"}), 406
    
    # Create a new charity record
    new_charity = Charity(charity_name=charity_name, email=email, password=password)
    db.session.add(new_charity)
    db.session.commit()
    return jsonify({
        "success": "Charity added successfully",
        "charity_id": new_charity.id
    }), 201

# Update a charity
@charity_bp.route('/charities/update/<int:charity_id>', methods=["PATCH"])
@jwt_required()
def update_charity(charity_id):
    # Assume the JWT identity is the charity's email
    current_identity = get_jwt_identity()
    charity = Charity.query.get(charity_id)
    if not charity:
        return jsonify({"error": "Charity not found"}), 404

    # Only allow update if the current charity's email matches the JWT identity
    if charity.email != current_identity:
        return jsonify({"error": "Unauthorized to update this charity"}), 403

    data = request.get_json()
    # Use the provided values or default to the current values
    new_charity_name = data.get("charity_name", charity.charity_name)
    new_email = data.get("email", charity.email)
    new_password = data.get("password", charity.password)  # Optionally allow password updates

    # If charity_name is being updated, ensure uniqueness (exclude current charity)
    if new_charity_name != charity.charity_name:
        existing = Charity.query.filter_by(charity_name=new_charity_name).first()
        if existing:
            return jsonify({"error": "Another charity with that name already exists"}), 409

    charity.charity_name = new_charity_name
    charity.email = new_email
    charity.password = new_password

    db.session.commit()
    return jsonify({"success": "Charity updated successfully"}), 200

# Delete a charity
@charity_bp.route('/charity/delete/<int:charity_id>', methods=['DELETE'])
@jwt_required()
def delete_charity(charity_id):
    # Assume the JWT identity is the charity's email
    current_identity = get_jwt_identity()
    charity = Charity.query.get(charity_id)
    if not charity:
        return jsonify({"error": "Charity not found"}), 404

    # Only allow deletion if the current charity's email matches the JWT identity
    if charity.email != current_identity:
        return jsonify({"error": "Unauthorized to delete this charity"}), 403

    db.session.delete(charity)
    db.session.commit()
    return jsonify({"success": "Charity deleted successfully"}), 200
