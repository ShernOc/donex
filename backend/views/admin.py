from flask import jsonify, request, Blueprint
from models import db, Admin
from datetime import datetime
from werkzeug.security import generate_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity

admin_bp= Blueprint("admin_bp", __name__)

@admin_bp.route('/admin', methods = ["GET"])

def get_admin():
    # get all the admins
    admins= Admin.query.all()
    admin_list = [{
            "id": admin.id,
            "full_name":admin.full_name,
            "email":admin.email
            }
        for admin in admins
        ]
    return jsonify({"Admins": admin_list}), 200 

#add an admin 
@admin_bp.route('/admin', methods = ['POST'])
# @jwt_required()
def register_admin():
    # current_user_id = get_jwt_identity()
    
    if not Admin.can_register():
        return jsonify({"Error":" Admin limit to 3, No more registration allowed"})

    # get the data
    data = request.get_json()
    full_name= data["full_name"]
    email = data["email"]
    password = generate_password_hash(data["password"])
    
    #Check name and email of the admin exist or not 
    check_name = Admin.query.filter_by(full_name=data["full_name"]).first()
    check_email = Admin.query.filter_by(email=data["email"]).first()

    if check_name and check_email:
        return jsonify({"Error":"Name/email already exist"}),406
     
    #new admin 
    new_admin = Admin( full_name=full_name, email=email,password =password)
    
    #call the function 
    db.session.add(new_admin)
    db.session.commit()
    return jsonify({"Success":"Admin added successfully"}), 200

      
#update the admin 
@admin_bp.route('/admin/<int:id>', methods = ['PATCH'])
@jwt_required()
def update_admin(id):#
    current_user_id = get_jwt_identity()
    # get all the admins
    admin = Admin.query.filter_by(id=current_user_id).first()
    if not admin: 
        return jsonify({"Error": "Not an admin/ authorized"}),400
    
    data = request.json
    full_name = data.get("full_name", admin.full_name)
    email = data.get("email",admin.email)
    
    check_name = Admin.query.filter(Admin.full_name==full_name).first()
    check_email = Admin.query.filter(Admin.email==email).first()

    if check_name and check_email:
        return jsonify({"Error":"Name/email already exist,update the admin"}),406
    else:
        admin.full_name = full_name
        admin.email = email
        
        #commit the work
        db.session.commit()
        return jsonify({
            "Success":"Admin updated successfully"
        }), 200
     
        
#delete the admin 
@admin_bp.route('/admin/delete/<int:admin_id>' ,methods=['DELETE'])  
@jwt_required()
def delete_admin(admin_id):
    current_user_id = get_jwt_identity()
    
    #get the all the admins
    admin = Admin.query.filter_by(id=admin_id).first() 
    
    if not admin or not current_user_id:
        return jsonify({"Error": " Admin not found or unauthorized"}), 404
    
    db.session.delete(admin)
    db.session.commit()
    
    return jsonify({"Success":"Admin deleted successfully"}), 200
