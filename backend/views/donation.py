# from flask import jsonify, request, Blueprint
# from sqlalchemy import func, extract
# from models import db, Donation
# from datetime import datetime
# from flask_jwt_extended import jwt_required, get_jwt_identity


# donation_bp = Blueprint("donation_bp", __name__)

# # Get donations with filtering
# @donation_bp.route('/donations', methods=['GET'])
# @jwt_required()
# def get_donations():
#     current_user_id = get_jwt_identity()
#     user_id = request.args.get("user_id", type=int)
#     charity_id = request.args.get("charity_id", type=int)

#     query = db.session.query(Donation)
#     if user_id: 
#         query = query.filter(Donation.user_id == user_id)
#     else:
#         query = query.filter(Donation.user_id == current_user_id)

#     if charity_id: 
#         query = query.filter(Donation.charity_id == charity_id)

#     donations = query.all()
    
#     # Calculate total donations per user
#     user_donations = db.session.query(Donation.user_id, func.sum(Donation.amount).label("total_amount")).group_by(Donation.user_id).all()
#     user_total = {user: total for user, total in user_donations}

#     # Calculate total donations per charity
#     charity_donations = db.session.query(Donation.charity_id, func.sum(Donation.amount).label("total_received")).group_by(Donation.charity_id).all()
#     charity_total = {charity: total for charity, total in charity_donations}

#     # Calculate total monthly donations
#     monthly_donations = (
#         db.session.query(
#             extract('year', Donation.donation_date).label('year'),
#             extract('month', Donation.donation_date).label('month'),
#             func.sum(Donation.amount).label('total_monthly')
#         ).group_by('year', 'month').all()
#     )
#     monthly_total = {f"{int(year)}-{int(month)}": total for year, month, total in monthly_donations}

#     grand_total = db.session.query(func.sum(Donation.amount)).scalar() or 0

#     return jsonify({
#         "user_donations": user_total,
#         "charity_donations": charity_total,
#         "grand_total_donations": grand_total,
#         "monthly_donations": monthly_total,
#     }), 200

# # Get the total donations
# @donation_bp.route('/donations', methods=['GET'])
# def get_total_donations():
#     grand_total = db.session.query(func.sum(Donation.amount)).scalar() or 0
#     return jsonify({"total_donations": grand_total}), 200

# # Create a new donation
# @donation_bp.route('/donations', methods=['POST'])
# @jwt_required()
# def create_donation():
#     current_user_id = get_jwt_identity()
#     data = request.get_json()

#     if not data or "charity_id" not in data or "amount" not in data:
#         return jsonify({"error": "Invalid request data"}), 400

#     try:
#         new_donation = Donation(
#             user_id=current_user_id,
#             charity_id=data["charity_id"],
#             amount=float(data["amount"])
#         )

#         db.session.add(new_donation)
#         db.session.commit()
#         return jsonify(new_donation.to_dict()), 201
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": str(e)}), 500

# # Update a donation
# @donation_bp.route('/donations/<int:donation_id>', methods=['PATCH'])
# @jwt_required()
# def update_donation(donation_id):
#     current_user_id = get_jwt_identity()
#     data = request.get_json()

#     donation = Donation.query.get(donation_id)

#     if not donation:
#         return jsonify({"error": "Donation not found"}), 404

#     if donation.user_id != current_user_id:
#         return jsonify({"error": "Not authorized to update this donation"}), 403

#     if "amount" in data:
#         donation.amount = data["amount"]

#     if "charity_id" in data:
#         donation.charity_id = data["charity_id"]

#     db.session.commit()
#     return jsonify(donation.to_dict()), 200

# # Delete a donation
# @donation_bp.route('/donations/<int:donation_id>', methods=['DELETE'])
# @jwt_required()
# def delete_donation(donation_id):
#     current_user_id = get_jwt_identity()
#     donation = Donation.query.get(donation_id)

#     if not donation:
#         return jsonify({"error": "Donation not found"}), 404

#     if donation.user_id != current_user_id:
#         return jsonify({"error": "Not authorized to delete this donation"}), 403

#     db.session.delete(donation)
#     db.session.commit()

#     return jsonify({"message": "Donation deleted successfully"}), 200

# # Delete all donations (admin only)
# @donation_bp.route('/donations/delete_all', methods=['DELETE'])
# @jwt_required()
# def delete_all_donations():
#     current_user_id = get_jwt_identity()

#     # Ensure only admin can delete all donations
#     if not current_user_id or not request.args.get("admin", type=bool):
#         return jsonify({"error": "Not authorized to delete all donations"}), 403

#     Donation.query.delete()
#     db.session.commit()
#     return jsonify({"message": "All donations deleted successfully"}), 200


from flask import jsonify, request, Blueprint
from sqlalchemy import func, extract
from models import db, Donation, DonationFrequency,DonationType, Transaction
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity


donation_bp = Blueprint("donation_bp", __name__)

# get the donation 
@donation_bp.route('/donations', methods =['GET'])
@jwt_required()
def get_donations():
    user_id = request.args.get("user_id", type=int)
    charity_id = request.args.get("charity_id", type=int)

    query = db.session.query(Donation)
    if user_id: 
        query = query.filter(Donation.user_id == user_id)
    if charity_id: 
        query = query.filter(Donation.charity_id == charity_id)

    donations = query.all()
    
    # Calculate total donations for the  user
    user_donations = db.session.query(Donation.user_id, func.sum(Donation.amount).label("total_amount")).group_by(Donation.user_id).all()
    user_total = {user: total for user, total in user_donations}

    # Calculate total donations for the charity
    charity_donations = db.session.query(Donation.charity_id, func.sum(Donation.amount).label("total_received")).group_by(Donation.charity_id).all()
    charity_total = {charity: total for charity, total in charity_donations}

    # Calculate total monthly donations
    monthly_donations = (
        db.session.query(
            extract('year', Donation.donation_date).label('year'),
            extract('month', Donation.donation_date).label('month'),
            func.sum(Donation.amount).label('total_monthly')
        ).group_by('year', 'month').all()
    )
    
    monthly_total = {f"{int(year)}-{int(month)}": total for year, month, total in monthly_donations}

    grand_total = db.session.query(func.sum(Donation.amount)).scalar() or 0

    return jsonify({
        "user_donations": user_total,
        "charity_donations": charity_total,
        "grand_total_donations": grand_total,
        "monthly_donations": monthly_total,
    }),200

# Get the total donations
@donation_bp.route('/donations/total', methods=['GET'])
def get_total_donations():
    grand_total = db.session.query(func.sum(Donation.amount)).scalar() or 0
    return jsonify({"total_donations": grand_total}), 200

# Create a new donation
@donation_bp.route('/donations', methods=['POST'])
# @jwt_required()
def create_donation():
    current_user_id=get_jwt_identity()
    
    print("Current User ID:", current_user_id)

    data = request.get_json()
    amount = data.get('amount')
    charity_id=data.get("charity_id")
    is_anonymous = data.get('is_anonymous', False)
    donation_type = data.get('donation_type', 'one-time').lower()
    donation_frequency = data.get('donation_frequency')
    
    if not amount or not charity_id:
        return jsonify({"error": "Invalid request data"}), 400

    # Validate donation type
    if donation_type not in [dt.value for dt in DonationType]:
        return jsonify({"error": "Invalid donation type"}), 400
    
    # Validate donation frequency if donation is recurring
    if donation_type == DonationType.RECURRING.value:
        if not donation_frequency or donation_frequency not in [df.value for df in DonationFrequency]:
            return jsonify({"error": "Recurring donations require a valid frequency"}), 400
    else:
        donation_frequency = None  # Ensure it's null for one-time donations

    try:
        new_donation = Donation(
        user_id=current_user_id,
        charity_id=charity_id,
        is_anonymous=is_anonymous, 
        amount=float(amount),
        donation_type=DonationType(donation_type),
        donation_frequency=DonationFrequency(donation_frequency) if donation_frequency else None
        )
        
        # Create a transaction record for PayPal
        new_transaction = Transaction(
            donation_id=new_donation.id,
            payment_method="PayPal",
            status="Pending",
            created_at=datetime.utcnow()
        )
        db.session.add(new_transaction)
        db.session.commit()

        db.session.add(new_donation)
        db.session.commit()
        
        return jsonify(new_donation.to_dict()), 201
    except Exception as e:
        db.session.rollback()
    return jsonify({"error":str(e)}), 500


# Update the donation 
@donation_bp.route('/donations/<int:donation_id>', methods=['PATCH'])
@jwt_required()
def update_donation(donation_id):
    current_user_id=get_jwt_identity()
    data = request.get_json()

    donation = Donation.query.get(donation_id)

    if not donation:
        return jsonify({"error": "Donation not found"}), 404

    if donation.user_id != current_user_id["id"]:
        return jsonify({"error": "Not authorized to update this donation"}), 403

    if "amount" in data:
        donation.amount = data["amount"]

    if "charity_id" in data:
        donation.charity_id = data["charity_id"]
        
    if "donation_type" in data:
        donation_type = data["donation_type"].lower()
        if donation_type not in [dt.value for dt in DonationType]:
            return jsonify({"error": "Invalid donation type"}), 400
        donation.donation_type = DonationType(donation_type)

    if "donation_frequency" in data:
        if donation.donation_type == DonationType.RECURRING:  # Only allow frequency for recurring
            donation_frequency = data["donation_frequency"].lower()
            if donation_frequency not in [df.value for df in DonationFrequency]:
                return jsonify({"error": "Invalid donation frequency"}), 400
            donation.donation_frequency = DonationFrequency(donation_frequency)
        else:
            donation.donation_frequency = None

    db.session.commit()
    return jsonify(({"Success":"Donation updated successfully"}))

# Delete a donation
@donation_bp.route('/donations/<int:donation_id>', methods=['DELETE'])
@jwt_required()
def delete_donation(donation_id):
    current_user_id =get_jwt_identity()
    donation = Donation.query.get(donation_id)

    if not donation:
        return jsonify({"error": "Donation not found"}), 404

    if donation.user_id != current_user_id["id"]:
        return jsonify({"error": "Not authorized to delete this donation"}), 403

    db.session.delete(donation)
    db.session.commit()

    return jsonify({"message": "Donation deleted successfully"})

# Delete all donations 
@donation_bp.route('/donations/delete_all', methods=['DELETE'])
@jwt_required()
def delete_all_donations():
    current_user_id =get_jwt_identity()

    if not current_user_id:
        return jsonify({"error": "Not authorized to delete this donation"}), 403

    Donation.query.delete()
    db.session.commit()
    return jsonify({"message": "All donations deleted successfully"}), 200

