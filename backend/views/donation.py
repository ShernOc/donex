from flask import jsonify, request, Blueprint
from models import db, Donation
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

donation_bp = Blueprint("donation_bp", __name__)

# get the donation 
@donation_bp()


#update the donations 




#delete the donations 



