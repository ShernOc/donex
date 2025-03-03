import requests
from flask import jsonify, request, Blueprint
from flask import Flask, request, jsonify
from models import db,Donation,Transaction
from config import PAYPAL_BASE_URL,PAYPAL_CLIENT_ID,PAYPAL_CLIENT_SECRET

paypal_bp = Blueprint("paypal", __name__)

# Function to get PayPal token
def get_paypal_token():
    auth_url = f"{PAYPAL_BASE_URL}/v1/oauth2/token"
    response = requests.post(auth_url, auth=(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET),
                             data={"grant_type": "client_credentials"})

    print("PayPal Token Response:", response.json())  # Debugging
    return response.json().get("access_token")


# Post an order
@paypal_bp.route("/create-donation", methods=["POST"])
def create_donation():
    data = request.json
    amount = data.get("amount")
    currency = "USD"
    user_id = data.get("user_id")
    charity_id = data.get("charity_id")
    payer_email = data.get("email")
    is_anonymous = data.get("is_anonymous", False)

    # Save donation to database
    new_donation = Donation(
        amount=amount,
        user_id=user_id,
        charity_id=charity_id,
        is_anonymous =is_anonymous
        
    )
    db.session.add(new_donation)
    db.session.commit()


# Create PayPal Order
    access_token = get_paypal_token()
    url = f"{PAYPAL_BASE_URL}/v2/checkout/orders"
    payload = {
        "intent": "CAPTURE",
        "purchase_units": [{
            "amount": {"currency_code": currency, "value": amount}
        }]
    }
    headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}

    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code == 201:
        order_data = response.json()
        paypal_order_id = order_data["id"]
        status = order_data["status"]

        # Save transaction in the database
        new_transaction = Transaction(
            paypal_order_id=paypal_order_id,
            status=status,
            amount=amount,
            currency=currency,
            payer_email=payer_email,
            donation_id=new_donation.id
        )
        db.session.add(new_transaction)
        db.session.commit()

        return jsonify({"message": "Donation and PayPal order created", "order": order_data})

    return jsonify({"error": "Failed to create PayPal order", "details": response.text}), 400


#update the  the transaction 
@paypal_bp.route("/paypal-callback", methods=["POST"])
def paypal_callback():
    data = request.json
    order_id = data.get("orderID")
    payment_status = data.get("status")

    # Find the transaction
    transaction = Transaction.query.filter_by(paypal_order_id=order_id).first()

    if transaction:
        transaction.status = payment_status
        db.session.commit()
        return jsonify({"message": "Transaction updated successfully"}), 200
    else:
        return jsonify({"error": "Transaction not found"}), 404


# Capture PayPal Payment
@paypal_bp.route("/paypal-payment/<order_id>", methods=["POST"])
def capture_paypal_payment(order_id):
    access_token = get_paypal_token()
    url = f"{PAYPAL_BASE_URL}/v2/checkout/orders/{order_id}/capture"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    response = requests.post(url, headers=headers)
    return jsonify(response.json())

    # approval_url = next(link['href'] for link in order["links"] if link["rel"] == "approve")

    # return jsonify({"order_id": order["id"], "approval_url": approval_url})


