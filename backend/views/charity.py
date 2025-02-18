from flask import jsonify, request, Blueprint
from models import db, Charity
from datetime import datetime

charity_bp = Blueprint("charity_bp",__name__)