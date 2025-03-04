import os
import requests
from flask import jsonify, request, Blueprint
from flask import Flask, request, jsonify
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET")
PAYPAL_BASE_URL = os.getenv("PAYPAL_BASE_URL")


# Function to get PayPal Access Token
def get_paypal_token():
    auth_url = f"{PAYPAL_BASE_URL}/v1/oauth2/token"
    response = requests.post(auth_url, auth=(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET),
                             data={"grant_type": "client_credentials"})
    return response.json().get("access_token")


# Create PayPal Order
@app.route("/create-paypal-order", methods=["POST"])
def create_paypal_order():
    access_token = get_paypal_token()
    url = f"{PAYPAL_BASE_URL}/v2/checkout/orders"

    data = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "USD",
                    "value": request.json.get("amount")
                }
            }
        ]
    }

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=data, headers=headers)
    return jsonify(response.json())


# Capture PayPal Payment
@app.route("/capture-paypal-payment/<order_id>", methods=["POST"])
def capture_paypal_payment(order_id):
    access_token = get_paypal_token()
    url = f"{PAYPAL_BASE_URL}/v2/checkout/orders/{order_id}/capture"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    response = requests.post(url, headers=headers)
    return jsonify(response.json())


