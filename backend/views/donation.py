from flask import jsonify, request, Blueprint
from sqlalchemy import func, extract
from models import db, Donation
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
    
    #getting the user id by 
    user_id = request.args.get('user_id')
    charity_id = request.args.get('charity_id')
    
    query = db.session.query(Donation)
    if user_id: 
        query = query.filter(Donation.user_id == user_id)
    if charity_id: 
        query = query.filter(Donation.charity_id == charity_id)
    
    donations = query.all()
    
     # Calculate total donations per user
    user_donations = db.session.query(Donation.user_id, func.sum(Donation.amount).label("total_amount")).group_by(Donation.user_id).all()
    
    user_total = {user: total for user, total in user_donations}
    
    # Calculate total donations per charity
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
    

# Create a new donation
@donation_bp.route('/donations', methods=['POST'])
@jwt_required()
def create_donation():
    current_user_id=get_jwt_identity()
    data=request.get_json()
    
    print("Current User ID:", current_user_id)

    
    if not data or "charity_id" not in data or "amount" not in data:
        return jsonify({"error": "Invalid request data"}), 400
    
    try:
        new_donation = Donation(
        user_id=current_user_id,
        charity_id=data["charity_id"],
        amount= float(data["amount"]))
    
    
        db.session.add(new_donation)
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
    
    if donation.user_id != current_user_id["id"]:
        return jsonify({"error": "Not authorized to update this donation"}), 403
    
    
    if "amount" in data:
        donation.amount = data["amount"]
        
    if "charity_id" in data:
        donation.charity_id = data["charity_id"]

    db.session.commit()
    # db.refresh(donation)
    
    return jsonify(({"Success":"Donation updated successfully"}))

# add the toastify
    # return jsonify({"message": "Donation updated successfully"}), 200
    
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

# delete all the donations 
# Delete a donation
@donation_bp.route('/donations/delete_all', methods=['DELETE'])
@jwt_required()
def delete_all_donations():
    current_user_id =get_jwt_identity()
    
    if not current_user_id:
        return jsonify({"error": "Not authorized to delete this donation"}), 403
    
    Donation.query.delete()
    db.session.commit()
    return jsonify({"message": "All donations deleted successfully"}), 200
    


# @app.route("/stories/delete_all", methods=["DELETE"])
# @jwt_required()
# def delete_all_stories():
#     try:
#         Story.query.delete()  # Delete all stories from the database
#         db.session.commit()
#         return jsonify({"message": "All stories deleted successfully"}), 200
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": str(e)}), 500


