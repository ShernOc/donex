import requests
from flask import jsonify, request, Blueprint
from models import db, Transaction, Donation
from flask_jwt_extended import jwt_required, get_jwt_identity
from config import PAYPAL_BASE_URL, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET

paypal_bp = Blueprint("paypal", __name__)

# Function to get PayPal Access Token
def get_paypal_token():
    auth_url = f"{PAYPAL_BASE_URL}/v1/oauth2/token"
    headers = {"Accept": "application/json", "Accept-Language": "en_US"}
    data = {"grant_type": "client_credentials"}

    response = requests.post(
        auth_url,
        auth=(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET),
        data=data,
        headers=headers
    )

    if response.status_code == 200:
        return response.json().get("access_token")
    else:
        print("PayPal Auth Failed:", response.status_code, response.text)
        return None

# Create a donation and PayPal order
@paypal_bp.route("/create-donation", methods=["POST"])
@jwt_required()
def create_donation():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    # Validate input
    if not data or "amount" not in data or "charity_id" not in data:
        return jsonify({"error": "amount and charity_id are required"}), 400

    amount = data.get("amount")
    charity_id = data.get("charity_id")
    payer_email = data.get("email", "")  # Default empty if not provided
    is_anonymous = data.get("is_anonymous", False)

    # Save donation to database
    new_donation = Donation(
        amount=amount,
        user_id=current_user_id,
        charity_id=charity_id,
        is_anonymous=is_anonymous
    )
    db.session.add(new_donation)
    db.session.commit()

    # Create PayPal Order
    access_token = get_paypal_token()
    if not access_token:
        return jsonify({"error": "Failed to authenticate with PayPal"}), 500

    url = f"{PAYPAL_BASE_URL}/v2/checkout/orders"
    payload = {
        "intent": "CAPTURE",
        "purchase_units": [{
            "amount": {"currency_code": "USD", "value": str(amount)}
        }]
    }
    headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 201:
        order_data = response.json()
        paypal_order_id = order_data.get("id")
        status = order_data.get("status")

        approval_url = next((link["href"] for link in order_data.get("links", []) if link["rel"] == "approve"), None)

        if not approval_url:
            return jsonify({"error": "No PayPal approval link found."}), 500

        # Save transaction to database
        new_transaction = Transaction(
            paypal_order_id=paypal_order_id,
            status=status,
            amount=amount,
            currency="USD",
            payer_email=payer_email,
            donation_id=new_donation.id
        )
        db.session.add(new_transaction)
        db.session.commit()

        return jsonify({
            "message": "Donation and PayPal order created successfully.",
            "order": order_data,
            "paypalLink": approval_url
        }), 201

    return jsonify({"error": "Failed to create PayPal order", "details": response.text}), 400
