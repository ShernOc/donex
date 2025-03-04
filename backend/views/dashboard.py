from flask import Blueprint, jsonify
from datetime import datetime, timedelta
from models import db, Donation
from sqlalchemy import func

# Create a Blueprint for dashboard stats
dashboard_bp = Blueprint('dashboard_bp', __name__)

@dashboard_bp.route('/dashboard-stats', methods=['GET'])
def get_dashboard_stats():
    try:
        # Total Donations
        total_donations = db.session.query(func.sum(Donation.amount)).scalar() or 0

        # Total Donors (count of unique users)
        total_donors = db.session.query(Donation.user_id).distinct().count()

        # Get first and last day of the current month
        today = datetime.utcnow()
        first_day_current = today.replace(day=1)
        first_day_last = (first_day_current - timedelta(days=1)).replace(day=1)

        # Donations this month
        current_month_donations = db.session.query(func.sum(Donation.amount))
        current_month_donations = current_month_donations.filter(Donation.donation_date >= first_day_current).scalar() or 0

        # Donations last month
        last_month_donations = db.session.query(func.sum(Donation.amount))
        last_month_donations = last_month_donations.filter(
            (Donation.donation_date >= first_day_last) & (Donation.donation_date < first_day_current)
        ).scalar() or 0

        # Calculate monthly growth percentage
        if last_month_donations > 0:
            monthly_growth = ((current_month_donations - last_month_donations) / last_month_donations) * 100
        else:
            monthly_growth = 100 if current_month_donations > 0 else 0

        stats = {
            "totalDonations": total_donations,
            "totalDonors": total_donors,
            "monthlyGrowth": f"{monthly_growth:.2f}%"
        }

        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
