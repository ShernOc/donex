from flask import jsonify, request, Blueprint
from sqlalchemy import func
from models import db, Charity,User
from flask_jwt_extended import jwt_required, get_jwt_identity,create_access_token, get_jwt
from werkzeug.security import generate_password_hash
from datetime import timedelta

charity_bp = Blueprint("charity_bp", __name__)


# Post a charity no need to be login 
@charity_bp.route('/charities', methods=["POST"])
def post_charity():
    data = request.get_json()
    charity_name = data.get("charity_name")
    password =generate_password_hash(data.get("password")) 
    email=data.get("email")
    description=data.get("description")
    url =data.get("url")
    # approved="pending"
  
    # Validate required fields
    if not charity_name or not password or not email:
        return jsonify({"error": "Missing required fields"}), 400

    # Check if a charity with this charity_name already exists
    existing_charity = Charity.query.filter_by(charity_name=charity_name).first()
    if existing_charity:
        return jsonify({"error":"Charity already exists"}), 406
    
    # Create a new charity record
    new_charity = Charity(charity_name=charity_name, email=email, password=password, user_id=None, url=url, description=description)
                                    
    # description= description, user_id=user_id)
    
    db.session.add(new_charity)
    db.session.commit()
    
    return jsonify({
        "success": "Charity added successfully",
        "charity_id": new_charity.id
    }), 200

 
# Get all charities
@charity_bp.route('/charities', methods=['GET'])
@jwt_required()
def get_charities():
    # Get all charities regardless of the current user.
    charities = Charity.query.all()
    total_charities=db.session.query(func.count(Charity.id)).scalar()
    
    return jsonify({
        "total_charities": total_charities, 
        "charities":[{
            "id": charity.id,
            "charity_name":charity.charity_name,
            "email":charity.email,
            "user_id":charity.user_id,
            "description":charity.description,
            "url":charity.url
            # "approved":charity.approved
        }  for charity in charities ]} ), 200 
    

# Get a charity by id
@charity_bp.route('/charities/<int:charity_id>', methods=['GET'])
@jwt_required()
def get_charity_by_id(charity_id):
    charity = Charity.query.get(charity_id)
    
    if not charity:
        return jsonify({"error":"Charity not found"}), 404
    return jsonify({
        "id": charity.id,
        "charity_name": charity.charity_name,
        "email": charity.email,
        "user_id":charity.user_id,
        "description":charity.description,
        "url":charity.url
        # "approved":charity.approved
    }), 200


# Update a charity
@charity_bp.route('/charities/update/<int:charity_id>', methods=["PATCH"])
@jwt_required()
def update_charity(charity_id):
    current_user_id= get_jwt_identity()
    user = User.query.get(current_user_id)
    charity = Charity.query.get(charity_id)
    
    if not charity:
        return jsonify({"error": "charity not found"})
    
    if not user or (user.role !="admin" and charity.user_id != current_user_id):
        return jsonify({"error": "Unauthorized to update the charity "}), 404
  
    data = request.get_json()
    if "charity_name" in data:
        existing = Charity.query.filter(Charity.charity_name == data["charity_name"], Charity.id != charity.id).first()
        if existing:
            return jsonify({"error": "Another charity with that name already exists"}), 409
        charity.charity_name = data["charity_name"]
    
        # update the form 
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
    if "url" in data:
        charity.url = data["url"]

    if "password" in data:
        charity.password = generate_password_hash(data["password"])

    db.session.commit()
    return jsonify({"success": "Charity updated successfully"}), 200

# Delete a charity
@charity_bp.route('/charities/delete/<int:charity_id>', methods=['DELETE'])
@jwt_required()
def delete_charity(charity_id):
    current_user_id= get_jwt_identity()
    user = User.query.get(current_user_id)
    charity = Charity.query.get(charity_id)
    
    if not charity:
        return jsonify({"error": "Charity not found"})
    
    # admin, charity can delete the charity 
    if not user or (user.role !="admin" and charity.user_id != current_user_id):
        return jsonify({"error": "Unauthorized to update the charity "}), 403
    
    db.session.delete(charity)
    db.session.commit()
    return jsonify({"Success": "Charity deleted successfully"}), 200

# @charity_bp.route('/charities/delete_all', methods=['DELETE'])
# @jwt_required()
# def delete_all_charities():
#     current_user_id =get_jwt_identity()
    
#     if not current_user_id:
#         return jsonify({"error": "Not authorized to delete this donation"}), 403
    
#     Charity.query.delete()
#     db.session.commit()
#     return jsonify({"message": "All charities deleted successfully"}), 200
