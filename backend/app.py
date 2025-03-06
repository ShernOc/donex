from flask import Flask, jsonify
from flask_migrate import Migrate
from models import db, TokenBlocklist
from flask_jwt_extended import JWTManager
from datetime import timedelta
from flask_cors import CORS
from flask_mail import Mail
import os

app = Flask(__name__)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://donex_db_539e_user:iECJTdtynhUqXVOL184YEOxI0HLGtK2y@dpg-cv4ekjij1k6c73biuj3g-a.oregon-postgres.render.com/donex_db_539e' 

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
migrate = Migrate(app, db)
CORS(app, resources={r"/*": {"origins":  "https://donex-5ecc.vercel.app"}}, 
     
     supports_credentials=True, 
     methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], 
     allow_headers=["Content-Type", "Authorization"])


# JWT Configuration
app.config["JWT_SECRET_KEY"] = "jiyucfvbkaudhudkvfbt" 

app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

jwt = JWTManager(app)

# Flask-Mail Configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'collinskathu7@gmail.com'  
app.config['MAIL_PASSWORD'] ='dqdc cghl djdx fuex'  
app.config['MAIL_DEFAULT_SENDER'] = "collinskathu7@gmail.com"

mail = Mail(app)

# PAYPAL Payments Configuration
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET")
PAYPAL_BASE_URL = os.getenv("PAYPAL_BASE_URL")


# Import views
from views import *
from views import story_bp

# Register blueprints
app.register_blueprint(user_bp)
app.register_blueprint(charity_bp)
app.register_blueprint(donation_bp)
app.register_blueprint(story_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(target_bp)
app.register_blueprint(paypal_bp)

# Error handling
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({"error": "Not Found"}), 404

@app.route('/')
def index(): 
    return jsonify({"Success": "Donex Charity Platform"})

# JWT token revocation callback
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    """Check if a JWT is revoked."""
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
    return token is not None

if __name__ == '__main__':
    app.run(debug=True, port=5000)


