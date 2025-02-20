from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, ForeignKey
from sqlalchemy.orm import relationship

metadata = MetaData()
db = SQLAlchemy(metadata=metadata)

# Define the User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False, unique=True)
    password = db.Column(db.String(512), nullable=False)

    # Relationships
    charities = relationship("Charity", back_populates="users")
    donations = relationship("Donation", back_populates="user")

class Charity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    organization = db.Column(db.String(128), nullable=False, unique=True)
    
    #Foreign keys
    user_id= db.Column(db.Integer, db.ForeignKey("users.id"), nullable = False)
    
    # Relationships
    user= relationship("User", back_populates="charities")
    donations = relationship("Donation", back_populates="charity")
    
    
class Story(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable = False)
    #Relationsships
    user= relationship("User", back_populates="stories")

class Donation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    donation_date = db.Column(db.DateTime, nullable=False)
    type= db.Column(db.String, nullable=False)

    # Foreign keys
    user_id = db.Column(db.Integer, ForeignKey("user.id"))
    charity_id = db.Column(db.Integer, ForeignKey("charity.id"))

    # Relationships
    user = relationship("User", back_populates="donations")
    charity = relationship("Charity", back_populates="donations")

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False, unique=True)
    password = db.Column(db.String(512),nullable=False)

    # limit to 3 admins
    @staticmethod
    def can_register():
        return Admin.query.count() < 3
      
      
class TokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False)

