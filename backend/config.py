import os
from dotenv import load_dotenv, find_dotenv

# PAYPAL Payments:

dotenv_path = find_dotenv() 
load_dotenv(dotenv_path)

# PAYPAL 
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET")
PAYPAL_BASE_URL = os.getenv("PAYPAL_BASE_URL")