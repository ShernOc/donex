from flask import Flask, jsonify
from flask_migrate import Migrate
from models import db, TokenBlocklist
from flask_jwt_extended import JWTManager
from datetime import timedelta
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth
from views import user_bp, charity_bp, donation_bp, admin_bp

# Initialize Flask app
app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS)
CORS(app, supports_credentials=True)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///donex.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# OAuth configurations
app.config['GOOGLE_CLIENT_ID'] = "464191634541-ia1thmau2nnpqakl0sdeu2hm0kc8gthu.apps.googleusercontent.com"
app.config['GOOGLE_CLIENT_SECRET'] = "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"
app.config['GITHUB_CLIENT_ID'] = "Ov23li7OVvp8rTjqOnnA"
app.config['GITHUB_CLIENT_SECRET'] = "51f8733d82eb4a1f0274f49218ca174a0b7b5f88"

# JWT configuration
app.config["JWT_SECRET_KEY"] = "jiyucfvbkaudhudkvfbt"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)

jwt = JWTManager(app)
oauth = OAuth(app)

# OAuth setup for Google
oauth.register(
    name='google',
    client_id=app.config['GOOGLE_CLIENT_ID'],
    client_secret=app.config['GOOGLE_CLIENT_SECRET'],
    access_token_url='https://oauth2.googleapis.com/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    client_kwargs={
        'scope': 'openid email profile',
    },
)

# OAuth setup for GitHub
oauth.register(
    name='github',
    client_id=app.config['GITHUB_CLIENT_ID'],
    client_secret=app.config['GITHUB_CLIENT_SECRET'],
    access_token_url='https://github.com/login/oauth/access_token',
    authorize_url='https://github.com/login/oauth/authorize',
    api_base_url='https://api.github.com/',
    client_kwargs={
        'scope': 'user:email',
    },
)

# JWT token revocation callback
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    """Check if a JWT is revoked."""
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
    return token is not None

# Register blueprints
app.register_blueprint(user_bp)
app.register_blueprint(charity_bp)
app.register_blueprint(donation_bp)
app.register_blueprint(admin_bp)

# Error handling for unknown routes
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({"error": "Not Found"}), 404

# Error handling for internal server errors
@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal Server Error"}), 500

# Run the application
if __name__ == "__main__":
    app.run(debug=True)
