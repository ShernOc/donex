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

class Donation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    donation_date = db.Column(db.DateTime, nullable=False)

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
    