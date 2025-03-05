from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Charity, db, User

# Define blueprint
target_bp = Blueprint("target", __name__)

# Route to submit charity verification
@target_bp.route("/charities/verify", methods=["POST"])
@jwt_required()
def verify_charity():
    current_user = get_jwt_identity()
    data = request.json
    new_charity = Charity(
        charity_name=data.get("charity_name"),
        phone_number=data.get("phone_number"),
        bank_name=data.get("bank_name"),
        email=data.get("email"),
        description=data.get("description"),
        profile_picture=data.get("profile_picture", ""),
        password=data.get("password", ""),
        account_number=data.get("account_number"),
        account_holder=data.get("account_holder"),
        targeted_amount=data.get("targeted_amount", 0.0),
        user_id=User.query.filter_by(id=int(current_user)).first().id,
    )

    db.session.add(new_charity)
    db.session.commit()

    return jsonify({"message": "Charity verification submitted successfully!"}), 201

# Route to get all charities
@target_bp.route("/charities", methods=["GET"])
def get_charities():
    charities = Charity.query.all()
    return jsonify({
        "charities": [
            {
                "id": charity.id,
                "charityName": charity.charity_name,
                "phoneNumber": charity.phone_number,
                "bankName": charity.bank_name or "",
                "accountNumber": charity.account_number or "",
                "accountHolder": charity.account_holder or "",
                "targetedAmount": charity.targeted_amount,
                "status": charity.status,
            }
            for charity in charities
        ]
    })

# Route to get pending charities for admin review
@target_bp.route("/admin/charities/pending", methods=["GET"])
@jwt_required()
def get_pending_charities():
    pending_charities = Charity.query.filter_by(status="pending").all()
    return jsonify([
        {
            "id": charity.id,
            "charityName": charity.charity_name,
            "description": charity.description,
            "phoneNumber": charity.phone_number,
            "email": charity.email,
            "bankName": charity.bank_name,
            "accountNumber": charity.account_number,
            "accountHolder": charity.account_holder,
            "targetedAmount": charity.targeted_amount,
        }
        for charity in pending_charities
    ])

# Route to approve or reject a charity
@target_bp.route("/admin/charities/<int:charity_id>", methods=["PATCH"])
@jwt_required()
def update_charity_status(charity_id):
    data = request.json
    charity = Charity.query.get_or_404(charity_id)
    if "approved" in data and isinstance(data["approved"], bool):  # Check for boolean value
        charity.approved = data["approved"]
        db.session.commit()
        return jsonify({"message": "Charity status updated"})
    return jsonify({"message": "Invalid status"}), 400

# Route to get a charity's status
@target_bp.route("/charities/<int:charity_id>/status", methods=["GET"])
def get_charity_status(charity_id):
    charity = Charity.query.get_or_404(charity_id)
    return jsonify({"charity_id": charity.id, "status": charity.approved})

# Updated Route to get only approved charities
@target_bp.route("/charities", methods=["GET"])
def get_approved_charities():
    approved_charities = Charity.query.filter_by(approved=True).all()
    return jsonify({
        "charities": [
            {
                "id": charity.id,
                "charity_name": charity.charity_name,
                "phone_number": charity.phone_number,
                "bank_name": charity.bank_name or "",
                "account_number": charity.account_number or "",
                "account_holder": charity.account_holder or "",
                "targeted_amount": charity.targeted_amount,
                "status": charity.approved,
                "email": charity.email,
            }
            for charity in approved_charities
        ]
    })
    
    
