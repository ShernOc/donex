from flask import jsonify, request, Blueprint
from models import db, Donation
from datetime import datetime

donation_bp = Blueprint("donation_bp", __name__)


