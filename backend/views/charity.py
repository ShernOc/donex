from flask import jsonify, request, Blueprint
from models import db, Charity, Admin, User
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

charity_bp = Blueprint("charity_bp",__name__)

#get all charities
@charity_bp.route('/charities', methods = ['GET'])
@jwt_required()
def get_charity():
    # get all the charity
    current_user_id = get_jwt_identity()
    charities = Charity.query.all()
    
    charity_list= []
    # if logged in show case the charity
    if current_user_id: 
        for charity in charities:
            charity_list.append({ 
            "id": charity.id,
            "organization":charity.organization,
            "user_id": charity.user_id,
            "type":charity.type

            }) 
        return jsonify({"Charity": charity_list}), 200
    else: 
         return jsonify({"Error": "Login to view the charities"}),400 

# Get charity by current_user_id 
@charity_bp.route('/charities/<int:charity_id>', methods=['GET'])
@jwt_required()
def get_charity_id(charity_id):
    current_user_id = get_jwt_identity()
    
    # get a single charity post that belongs to the currently logged-in user.
    charity = Charity.query.filter_by(id=charity_id, user_id = current_user_id).first()
    
    if not charity: 
        return jsonify({"Error":"No charities found"}), 404
    return jsonify({  
        "id":charity.id,
        "organization":charity.organization,
        "user_id": charity.user_id,
        "type":charity.type
        }
    )

    
#Post a charity
@charity_bp.route('/charity', methods = ["POST"])
@jwt_required()
def post_charity():
    current_user_id = get_jwt_identity()
    
# get the data
    data = request.get_json()
    organization = data.get("organization")
    type = data.get("type")
    
    #Check organization exist and if error message. 
    check_organization = Charity.query.filter(organization==organization).first()

    if not check_organization:
        return jsonify({"Error":"The Charity already exist or posted"}), 406
    else: 
        #create a new charity
        new_charity = Charity(organization=organization, type=type, user_id=current_user_id)
        
        #call the function 
        db.session.add(new_charity)
        db.session.commit()
        return jsonify({"Success":"Charity added successfully"}), 201
      
#Update a charity
@charity_bp.route('/charities/update/<int:charity_id>', methods =["PATCH"])
@jwt_required()
def update_charity(charity_id):
    current_user_id = get_jwt_identity()
    
    charity=Charity.query.filter_by(id=charity_id).first()
    admin = Admin.query.get(current_user_id)
    
    if not charity:
        return jsonify({"Error": "Charity not found"}),404
   
    if charity.user_id != current_user_id and not admin:
        return jsonify({"Error":"You are Unauthorized to edit the charity"}), 403
    
    #if the data is not provided issues the data
    data = request.get_json()
    organization= data.get("organization", charity.organization)
    type = data.get("type", charity.type)
   
    check_organization = Charity.query.filter(Charity.organization==organization).first()
    check_type = Charity.query.filter(Charity.type==type).first()
    
    if check_organization and check_type: 
        return jsonify({"Error":"An organization with this title and already exist. Update the organization"}),409
    
    charity.organization=organization        
    charity.type=type
    
    #commit the function 
    db.session.commit()
    return jsonify({"Success":f"Charity was updated successfully"}),200

# Delete charity only by the user/admin
@charity_bp.route('/charity/delete/<int:charity_id>',methods=['DELETE']) 
@jwt_required()
def delete_charity(charity_id):
    current_user_id = get_jwt_identity()
    
    charity =Charity.query.filter_by(id=charity_id).first()
    admin = Admin.query.get(current_user_id)
    if not charity:
        return jsonify({"Error": "Charity not found"})
    
    if charity.user_id !=current_user_id and not admin:
        return jsonify({"Error": "Charity not found/Unauthorized"}), 406 
    
    db.session.delete(charity)
    db.session.commit()
    return jsonify({"Success": f"A charity with has been deleted Successfully"})
