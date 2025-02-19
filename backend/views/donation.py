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
    
    #getting the user id by 
    user_id = request.args.get('user_id')
    charity_id = request.args.get('charity_id')
    
    query = db.session.query(Donation)
    if user_id: 
        query = query.filter(Donation.user_id == user_id)
    if charity_id: 
        query = query.filter(Donation.charity_id == charity_id)
         
    # total user donation 
    user_donations = db.session.query(
        Donation.user_id, func.sum(Donation.amount).label("total_amount")
    ).group_by(Donation.user_id)
    
    # for the user, 
    if user_id:
        user_donations = user_donations.filter(Donation.user_id)
    user_donations = user_donations.all()
    
# Total Charity donation
    charity_donations = db.session.query(
        Donation.charity_id, func.sum(Donation.amount).label("total_received")
    ).group_by(Donation.charity_id)
    
    if charity_id:
        charity_donations = charity_donations.filter(Donation.charity_id == charity_id)
    charity_donations = charity_donations.all()

    # Grand total of all donations
    grand_total = db.session.query(func.sum(Donation.amount)).scalar() or 0
     
#  Monthly donation 
    monthly_donations = db.session.query(
        extract('year', Donation.donation_date).label('year'),
        extract('month', Donation.donation_date).label('month'),
        #sum of the donation
        func.sum(Donation.amount).label('total_monthly')
    ).group_by('year', 'month')

    if user_id:
        monthly_donations = monthly_donations.filter(Donation.user_id == user_id)

    if charity_id:
        monthly_donations = monthly_donations.filter(Donation.charity_id == charity_id)

    monthly_donations = monthly_donations.all()

    # Formatting response
    user_total = {user_id: total for user, total in user_donations}
    charity_total= {charity_id: total for charity, total in charity_donations}
    monthly_total = {
        f"{int(year)}-{int(month)}": total for year, month, total in monthly_donations
    }
    

    return jsonify({
        "user_donations": user_total, # {user_id: total_donated}
        "charity_donations": charity_total,# {charity_id: total_received}
        "grand_total_donations": grand_total,  # Total sum of all donations
        "monthly_donations": monthly_total, # {"YYYY-MM": total}
       
    }), 200

# Update a donation
@donation_bp.route('/donations/<int:donation_id>', methods=['PUT'])
def update_donation(donation_id):
    data = request.json
    donation = Donation.query.get(donation_id)

    if not donation:
        return jsonify({"error": "Donation not found"}), 404

    if "amount" in data:
        donation.amount = data["amount"]
    if "donation_date" in data:
        donation.donation_date = data["donation_date"]
    if "user_id" in data:
        donation.user_id = data["user_id"]
    if "charity_id" in data:
        donation.charity_id = data["charity_id"]

    db.session.commit()
    return jsonify({"message": "Donation updated successfully"}), 200



# Delete a donation
@donation_bp.route('/donations/<int:donation_id>', methods=['DELETE'])
def delete_donation(donation_id):
    donation = Donation.query.get(donation_id)

    if not donation:
        return jsonify({"error": "Donation not found"}), 404
    
    db.session.delete(donation)
    db.session.commit()