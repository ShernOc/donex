from flask import jsonify, request, Blueprint
from models import db, Admin
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

admin_bp= Blueprint("admin_bp", __name__)

@admin_bp.route('/admin', methods = ["GET"])

def get_admin():
    # get all the admins
    admins = Admin.query.all()
    admin_list = []
    for admin in admins:
        admin_list.append({
            "id": admin.id,
            "fullname":admin.fullname,
            "email":admin.email,
        })
        return jsonify({"Admins": admin_list}), 200 

#add an admin 
@admin_bp.route('/admin>', methods = ['POST'])
@jwt_required()
def update_admin():
    current_user_id = get_jwt_identity()

    if current_user_id:
    # get the data
        data = request.get_json()
        fullname= data["fullname"]
        email = data["email"]
    
    #Check name and email of the admin exist or not create an error message.
    check_name = Admin.query.filter(Admin.full_name==fullname).first()
    check_email = Admin.query.filter(Admin.email==email).first()

    if check_name and check_email:
        return jsonify({"Error":"Name/email already exist"}),406
    else: 
        #new admin 
        new_admin = Admin(fullname=fullname,user_id=current_user_id,email=email)
        
        #call the function 
        db.session.add(new_admin)
        db.session.commit()
        return jsonify({"Success":"Admin added successfully"}), 201

      
#update the admin 
@admin_bp.route('/admin/<int:id>', methods = ['PATCH'])
@jwt_required()
def update_admin(id):#
    current_user_id = get_jwt_identity()
    # get all the admins
    admin = Admin.query.filter_by(id)
    if not admin: 
        return jsonify({"Error": "Not an admin/ authorized"}),400
    
    data = request.json()
    fullname = data.get("fulname", admin.fullname)
    email = data.get("email",admin.email)
    
    #Check name and email of the admin exist or not create an error message.
    check_name = Admin.query.filter(Admin.full_name==fullname).first()
    check_email = Admin.query.filter(Admin.email==email).first()

    if check_name and check_email:
        return jsonify({"Error":"Name/email already exist v update the admin"}),406
    else:
        admin.fullname = fullname
        admin.email = email
        
        #commit the work
        db.session.commit()
        return jsonify({
            "Success":"Admin updated successfully"
        }), 200
        
#delete the admin 
@admin_bp.route('/admin/delete/<int:id>' ,methods=['DELETE'])  
@jwt_required()
def delete_admin(id):
    current_user_id = get_jwt_identity()
    #get the all the blogs
    admin = Admin.query.filter_by(id = id, user_id = current_user_id).first()
    if not admin:
        return jsonify({"Error": "Not an Admin"})
    db.session.delete(admin)
    db.session.commit()
    
    return jsonify({"Success":"Admin deleted successfully"})
