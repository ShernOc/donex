from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData ,ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

metadata = MetaData()
db = SQLAlchemy(metadata=metadata)

# Define the User model
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    full_name = db.Column(db.String(100))
    # Relationships
    charities= relationship("Charity", back_populates="user")
    donations = relationship("Donation", back_populates="user")
    stories = relationship("Story", back_populates="user")

class Charity(db.Model):
    __tablename__ = "charities"
    
    id = db.Column(db.Integer, primary_key=True)
    organization = db.Column(db.String(128), nullable=False, unique=True)
    type= db.Column(db.String, nullable=False)
    
    #Foreign keys
    user_id= db.Column(db.Integer, db.ForeignKey("users.id"), nullable = False)
    
    # Relationships
    user= relationship("User", back_populates="charities")
    donations = relationship("Donation", back_populates="charities")
    
    
class Story(db.Model):
    __tablename__ = "stories"
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    content = db.Column(db.Text, nullable=False)
    
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable = False)
    #Relationships
    user= relationship("User", back_populates="stories")

class Donation(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    donation_date = db.Column(db.DateTime, nullable=False, default=func.now())
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    charity_id = db.Column(db.Integer, db.ForeignKey("charities.id", ondelete="CASCADE"))

    # Relationships
    user=relationship("User", back_populates="donations")
    charities= relationship("Charity", back_populates="donations")

class Admin(db.Model):
    __tablename__ ="admins"
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False, unique=True)
    password = db.Column(db.String(512),nullable=False)

    # limit to 3 admins
    @staticmethod
    def can_register():
        return Admin.query.count() < 3
      
class TokenBlocklist(db.Model):
    __tablename__ = "token_blocklist"
    __table_args__ = {"extend_existing": True}  # Prevents table redefinition error

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False)
    
