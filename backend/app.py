from flask import Flask, jsonify
from flask_migrate import Migrate
from models import db, TokenBlocklist
from flask_jwt_extended import JWTManager
from datetime import timedelta
from flask_cors import CORS
import os

# from authlib.integrations.flask_client import OAuth
from views import *

app = Flask(__name__)
CORS(app) 

#backend postgresql connection from render 

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://donex_db_user:takDWY5czIgTlDzsXsOtYqLTfs8ZVsAM@dpg-cuu60slds78s7396gcsg-a.oregon-postgres.render.com/donex_db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


print("Database URI:", app.config['SQLALCHEMY_DATABASE_URI'])

# Enable Cross-Origin Resource Sharing (CORS)
CORS(app, supports_credentials=True)

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)


# OAuth configurations
app.config['GOOGLE_CLIENT_ID'] = "464191634541-ia1thmau2nnpqakl0sdeu2hm0kc8gthu.apps.googleusercontent.com"
app.config['GOOGLE_CLIENT_SECRET'] = "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"
app.config['GITHUB_CLIENT_ID'] = "Ov23li7OVvp8rTjqOnnA"
app.config['GITHUB_CLIENT_SECRET'] = "51f8733d82eb4a1f0274f49218ca174a0b7b5f88"

# JWT configuration
app.config["JWT_SECRET_KEY"] = "jiyucfvbkaudhudkvfbt"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)


app.config["JWT_SECRET_KEY"] = "jiyucfvbkaudhudkvfbt" 
app.config["JWT_ACCESS_TOKEN_EXPIRES"] =  timedelta(hours=1)

jwt = JWTManager(app)
# oauth = OAuth(app)

# Register blueprints
app.register_blueprint(user_bp)
app.register_blueprint(charity_bp)
app.register_blueprint(donation_bp)
app.register_blueprint(admin_bp)

# Error handling for unknown routes
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({"error": "Not Found"}), 404

#SQLITE 
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

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()

# Error handling for internal server errors
@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal Server Error"}), 500

 
if __name__ == '__main__':
    app.run(debug=True)


# # Mail Credentials 
# # SMTP credentials
# app.config['MAIL_SERVER'] = 'smtp.gmail.com'
# app.config['MAIL_PORT'] = 587
# app.config['MAIL_USERNAME'] = 'sherlynea8622@gmail.com'
# app.config['MAIL_DEFAULT_SENDER'] = 'sherlynea8622@gmail.com'
# app.config['MAIL_PASSWORD'] = 'slim hbpc dwit bsli'
# app.config['MAIL_USE_TLS'] = True
# app.config['MAIL_USE_SSL'] = False

# #initialize 
# mail = Mail(app)

# #create an instance of Message 
# @app.route('/send_email')
# def email():
#     try: 
#         msg = Message(
#         subject = "First Email!",
#         sender = ['MAIL_DEFAULT_SENDER'],
#         recipients= ["sherlyne.ochieng@student.moringaschool.com","david.kakhayanga@student.moringaschool.com" ],
#         #What the message body will send
#         body = "Hello: You are welcomed to join collaborative Blogging platform")
        
#         mail.send(msg)
#         return jsonify({"Success": "Message sent Successfully"
#             })

#     except Exception as e: 
#         return jsonify({"Error" :"Message not sent"})

