from flask import Flask, jsonify, request, render_template
from flask_migrate import Migrate
from models import db, TokenBlocklist
from flask_jwt_extended import JWTManager
from datetime import timedelta
from flask_cors import CORS
import os


app = Flask(__name__)
CORS(app) 

# #postgreSQL connection
# DB_USERNAME=os.getenv("DB_USERNAME") #donex
# DB_PASSWORD=os.getenv("DB_PASSWORD") # 2609
# DB_NAME=os.getenv("DB_NAME") # donex_db
# DB_HOST = os.getenv("DB_HOST",) # local host 
# DB_PORT = os.getenv("DB_PORT") # 5432

# # app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

#POSTGRESQL  CONNECTION / BACKEND 

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://donex:2609@localhost:5432/donex_db"

#SQLITE CONNECTION
# initialize the donex.db table 
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///donex.db'

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

print("Database URI:", app.config['SQLALCHEMY_DATABASE_URI'])

db.init_app(app)
migrate = Migrate(app, db)

app.config["JWT_SECRET_KEY"] = "jiyucfvbkaudhudkvfbt" 
app.config["JWT_ACCESS_TOKEN_EXPIRES"] =  timedelta(hours=1)

jwt = JWTManager(app)
jwt.init_app(app)

# import all functions in views
from views import *

app.register_blueprint(user_bp)
app.register_blueprint(charity_bp)
app.register_blueprint(donation_bp)
app.register_blueprint(admin_bp)


#SQLITE 
@app.route('/')
def index(): 
    return jsonify ({"Success":"Donex"})

# # postgreSQL 
# @app.route('/')
# def index(): 
#     return render_template("index.html")


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()

    return token is not None

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