from flask import jsonify, request, Blueprint
from models import db, Charity, Admin
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
            #Provides the users associated with the charity
            "users":[
                    {
                        "id":users.id,
                        "name":users.name
                        
                    } for users in charity.users
                ] 
            }) 
        return jsonify({"Charity": charity_list}), 200
    else: 
         return jsonify({"Error": "Login to view the charities"}),400 

# Get charity by current_user_id 
@charity_bp.route('/charities/<int:id>', methods=['GET'])
@jwt_required()
def get_charity_id(id):
    current_user_id = get_jwt_identity()
    
    # get a single charity post that belongs to the currently logged-in user.
    charities = Charity.query.filter_by(id, user_id=current_user_id).all()
    if not charities: 
        return jsonify({"Error": "No charities found"}), 404
   
    charities_list = [{  
        "id": charity.id,
        "organization":charity.organization,
        "user_id": charity.user_id,
        }
    for charity in charities
    ]
    
    return jsonify({"Charities": charities_list})
       
#Post a charity
@charity_bp.route('/charity', methods = ["POST"])
@jwt_required()
def post_charity():
    current_user_id = get_jwt_identity()
    if current_user_id:
    # get the data
        data = request.get_json()
        organization = data["organization"]
        user_id = data["user_id"]
    
    #Check organization exist and if error message. 
    check_organization = Charity.query.filter(Charity.organization==organization).first()
    check_user_id = Charity.query.filter(Charity.user_id ==user_id).first()

    if check_organization and check_user_id:
        return jsonify({"Error":"The Charity already exist or posted"}), 406
    else: 
        #create a new charity
        new_charity = Charity(organization,user_id=current_user_id)
        
        #call the function 
        db.session.add(new_charity)
        db.session.commit()
        return jsonify({"Success":"Charity added successfully"}), 201
      
#Update a charity
@charity_bp.route('/charities/update/<int:id>', methods =["PATCH"])
@jwt_required()
def update_charity(id):
    current_user_id = get_jwt_identity()
    #get the charities 
    charity= Charity.query.get(id)
    
    # #all the admin
    # admin = Admin.query.all()
    
    # check if the user exist, 
    if not charity:
        return jsonify({"Error":"Charity not found"}), 404
    
    #checks if user is the owner or admin 
    if int(Charity.user_id) !=int(current_user_id) and not int(Admin.id):
        return jsonify({"Error": "You are Unauthorized to edit the charity"}), 403
    
    #if the data is not provided issues the data
    data = request.get_json()
    organization= data.get("organization", charity.organization)
    user_id = data.get("user_id", charity.user_id)
         
    check_organization = Charity.query.filter(Charity.organization==organization).first()
    check_user_id = Charity.query.filter(Charity.user_id ==user_id).first()

    if check_organization and check_user_id:
        return jsonify({"Error":"The Charity with the name already exist or posted"}), 406
    else: 
        #if no conflict update 
        charity.organization =organization        
        charity.user_id = current_user_id
        
        #commit the function 
        db.session.commit()
    return jsonify({"Success":f"Charity was updated successfully"}),200

# Delete charity only by the user/admin
@charity_bp.route('/charity/delete/<int:id>',methods=['DELETE']) 
@jwt_required()
def delete_charity(id):
    current_user_id = get_jwt_identity()
    
    charity =Charity.query.filter_by(id, user_id=current_user_id).first()
    
    if not charity:
        return jsonify({"Error": "Charity not found/Unauthorized"}), 406 
    
    db.session.delete(charity)
    db.session.commit()
    
    return jsonify({"Success": f"A charity with has been deleted Successfully"})


      