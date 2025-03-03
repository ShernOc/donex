from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData ,ForeignKey, CheckConstraint
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
    profile_picture = db.Column(db.String(512),nullable=False)

    role = db.Column(db.String(100), nullable=False,default="user")
    
    
    # Relationships
    charities= relationship("Charity", back_populates="user")
    
    # The user can be anonymous
    donations = relationship("Donation", back_populates="user")
    stories = relationship("Story", back_populates="user")
    
    __table_args__ = (
        CheckConstraint(role.in_(['user', 'admin', 'charity']), name="valid_role"),
    )
    
     # limit admin to 3 users
    @staticmethod
    def can_register():
        admin_count = db.session.query(func.count(User.id)).filter_by(role="admin").scalar()
        return admin_count < 3
     
class Charity(db.Model):
    __tablename__ = "charities"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(128), nullable=False, unique=True)
    charity_name = db.Column(db.String(128), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    password = db.Column(db.String(512), nullable=False)
    profile_picture = db.Column(db.String(1024), nullable=False)
    approved = db.Column(db.String(20), default="pending")
    
    # Verification fields
    phone_number = db.Column(db.String(20), nullable=False)
    bank_name = db.Column(db.String(255), nullable=True)
    account_number = db.Column(db.String(50), nullable=True, unique=True)
    account_holder = db.Column(db.String(255), nullable=True)
    targeted_amount = db.Column(db.Float, nullable=False)

    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    # Relationships
    user = relationship("User", back_populates="charities")
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
    #allow anonymous donation 
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"),nullable=True)
    charity_id = db.Column(db.Integer, db.ForeignKey("charities.id", ondelete="CASCADE"),nullable=False)
    
    #Anonymous donations 
    is_anonymous = db.Column(db.Boolean, default=False)
    
    # Relationships
    user=relationship("User", back_populates="donations")
    charities= relationship("Charity", back_populates="donations")

     
class TokenBlocklist(db.Model):
    __tablename__ = "token_blocklist"
    __table_args__ = {"extend_existing": True}  # Prevents table redefinition error

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False)
