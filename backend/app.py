from flask import Flask, jsonify
from flask_migrate import Migrate
from models import db, TokenBlocklist
from flask_jwt_extended import JWTManager
from datetime import timedelta
from flask_cors import CORS  
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///donex.db'
CORS(app)
migrate = Migrate(app, db)

# Database Configuration
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://donex_db_user:takDWY5czIgTlDzsXsOtYqLTfs8ZVsAM@dpg-cuu60slds78s7396gcsg-a.oregon-postgres.render.com/donex_db'

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

# JWT Configuration
app.config["JWT_SECRET_KEY"] = "jiyucfvbkaudhudkvfbt" 
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

jwt = JWTManager(app)

# Import views
from views import *

# Register blueprints
app.register_blueprint(user_bp)
# app.register_blueprint(charity_bp)
app.register_blueprint(donation_bp)
app.register_blueprint(story_bp)
app.register_blueprint(auth_bp)


@app.errorhandler(404)
def not_found_error(error):
    return jsonify({"error": "Not Found"}), 404
  
@app.route('/')
def index(): 
    return jsonify ({"Success":"Donex Charity Platform"})

# JWT token revocation callback
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    """Check if a JWT is revoked."""
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
    return token is not None
def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///donex.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)

    return app

# load_dotenv()

# PAYPAL Payments:
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET")
PAYPAL_BASE_URL = os.getenv("PAYPAL_BASE_URL")



if __name__ == '__main__':
    app.run(debug=True, port=5000) 
