from flask import jsonify, request, Blueprint
from models import db, Admin
from datetime import datetime

admin_bp= Blueprint("admin_bp", __name__)
