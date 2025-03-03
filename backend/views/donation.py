from flask import jsonify, request, Blueprint
from sqlalchemy import func, extract
from models import db, Donation, Transaction
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity


donation_bp = Blueprint("donation_bp", __name__)

# get the donation 
@donation_bp.route('/donations', methods =['GET'])
@jwt_required()
def get_donations():
    current_user_id = get_jwt_identity()
    
    user_id = request.args.get("user_id", type=int)
    charity_id = request.args.get("charity_id", type=int)
    
    query = db.session.query(Donation)
    if user_id: 
        query = query.filter(Donation.user_id == user_id)
    if charity_id: 
        query = query.filter(Donation.charity_id == charity_id)
    
    donations = query.all()
    
    # Paypal donations 
    result = []
    for donation in donations:
        transaction = Transaction.query.filter_by(donation_id=donation.id).first()
        payment_status = transaction.status if transaction else "Pending"

        result.append({
            "id": donation.id,
            "user_id": donation.user_id,
            "charity_id": donation.charity_id,
            "amount": donation.amount,
            "is_anonymous": donation.is_anonymous,
            "donation_type": donation.donation_type,
            "frequency": donation.frequency,
            "payment_status": payment_status
        })
    
     # Calculate total donations per user
    user_donations = db.session.query(Donation.user_id, func.sum(Donation.amount).label("total_amount")).group_by(Donation.user_id).all()
    
    user_total = {user: total for user, total in user_donations}
    
    # Calculate total donations per charity
    charity_donations = db.session.query(Donation.charity_id, func.sum(Donation.amount).label("total_received")).group_by(Donation.charity_id).all()
    
    charity_total = {charity: total for charity, total in charity_donations}
    
    #Calculate total monthly donations
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
        "donations":result,
        "user_donations": user_total,
        "charity_donations": charity_total,
        "grand_total_donations": grand_total,
        "monthly_donations": monthly_total,
    }),200
    
 
# Create a new donation / its also optional
@donation_bp.route('/donations', methods=['POST'])
@jwt_required(optional=True)
def create_donation():
    current_user_id=get_jwt_identity()
    # is_anonymous = data.get("Anonymous_user", False)
    data=request.get_json()
    
    print("Current User ID:", current_user_id)
    if not data or "charity_id" not in data or "amount" not in data:
        return jsonify({"error": "Invalid request data"}), 400
    
    try:
        new_donation = Donation(
        user_id=current_user_id,
        charity_id=data["charity_id"],
        amount= float(data["amount"]),
        is_anonymous =data.get("Anonymous_user", False),
        donation_type=data["donation_type"],
        frequency = data["frequency"]
    
        )
    
        db.session.add(new_donation)
        db.session.commit()
        
         # Create a transaction record for PayPal
        new_transaction = Transaction(
            donation_id=new_donation.id,
            payment_method="PayPal",
            status="Pending",
            created_at=datetime.utcnow()
        )
        db.session.add(new_transaction)
        db.session.commit()
        
        return jsonify(new_donation.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":str(e)}), 500


#update the donation 
@donation_bp.route('/donations/<int:donation_id>', methods=['PATCH'])
@jwt_required()
def update_donation(donation_id):
    current_user_id=get_jwt_identity()
    data = request.get_json()
    
    donation = Donation.query.get(donation_id)
    if not donation:
        return jsonify({"error": "Donation not found"}), 404
    
    if donation.user_id != current_user_id:
        return jsonify({"error": "Not authorized to update this donation"}), 403
    
    # if "amount" in data:
    #     donation.amount = data["amount"]
        
    # if "charity_id" in data:
    #     donation.charity_id = data["charity_id"]
    # if the transaction is pending, make the change 
    transaction = Transaction.query.filter_by(donation_id=donation.id).first()
    if transaction and transaction.status != "Pending":
        return jsonify({"error": "Cannot update a completed donation"}), 400

    db.session.commit()
    db.refresh(donation)
    
    return jsonify(({"Success":"Donation updated successfully"}))

   
# Delete a donation
@donation_bp.route('/donations/delete/<int:donation_id>', methods=['DELETE'])
@jwt_required()
def delete_donation(donation_id):
    current_user_id =get_jwt_identity()
    donation = Donation.query.get(donation_id)

    if not donation:
        return jsonify({"error": "Donation not found"}), 404
    
    if donation.user_id != current_user_id:
        return jsonify({"error": "Unauthorized to delete this donation"}), 403
    
    try:
        transaction = Transaction.query.filter_by(donation_id=donation_id).first()
        if transaction:
            db.session.delete(transaction)
    
        db.session.delete(donation)
        db.session.commit()
        return jsonify({"message": "Donation and transaction deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    


# # delete all the donations 
# # Delete a donation
# @donation_bp.route('/donations/delete_all', methods=['DELETE'])
# @jwt_required()
# def delete_all_donations():
#     current_user_id =get_jwt_identity()
#     donations = Donation.query.all()
    
#     if not current_user_id and not donations:
#         return jsonify({"error":"Not authorized to delete this donation"}), 403
    
#     db.session.query(Donation).delete()
#     db.session.commit()
#     return jsonify({"message": "All donations deleted successfully"}), 200
    
    
    # Donation.query.delete()
    # db.session.commit()
    
