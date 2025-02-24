from flask import jsonify, request, Blueprint
from models import db, Story, Admin
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

story_bp = Blueprint("story_bp",__name__)

#Get all stories:
@story_bp.route('/stories', methods = ['GET'])
# @jwt_required()
def get_story():
    # get all the stories
    # current_user_id = get_jwt_identity()
    stories= Story.query.all()

    story_list= []
    for story in stories:
            story_list.append({ 
            "id": story.id,
            "title":story.title,
            "content":story.content,
            "user_id":story.user_id
            }) 
    return jsonify({"All stories":story_list}), 200
       
#Create a story by admin
@story_bp.route('/stories', methods = ["POST"])
@jwt_required()
def post_story():
    current_user_id = get_jwt_identity()
    #fetch the admin
    admin = Admin.query.get(current_user_id)
    
    if not admin:
        return jsonify({"Error": "Only admins can post stories"}), 403
    
    data = request.get_json()
    title = data["title"]
    content = data["content"]

    #Check if the tittle already exist
    check_title = Story.query.filter(title==title).first()
    check_content = Story.query.filter(content==content).first()

    if check_title and check_content:
        return jsonify({"Error":"The story already exist or has been posted"}), 406
   
    #create a new story
    new_story =Story(title=title,user_id=current_user_id, content=content)
    
    #call the function 
    db.session.add(new_story)
    db.session.commit()
    return jsonify({"Success":"Story added successfully"}), 200
      
#Update a Story
@story_bp.route('/stories/update/<int:story_id>', methods =["PATCH"])
@jwt_required()
def update_story_id(story_id):
    current_user_id = get_jwt_identity()
    admin = Admin.query.filter_by(id=current_user_id).first()
    
    if not admin:
        return jsonify({"Error":" Only admins can update the stories"}), 404
    
    story= Story.query.get(story_id)
    # check if the user exist, 
    if not story:
         return jsonify({"Error":" Story not found"}), 404
    
    #if the data is not provided issues the data
    data = request.get_json()
    title = data.get("title",story.title)
    content = data.get("content",story.content)    
             
    check_title = Story.query.filter(Story.title==title).first()
    check_content= Story.query.filter(Story.content==content).first()
         
    if check_title and check_content:
        return jsonify({"Error":"A story with this title and already exist. Update the story"}),409

    #if no conflict update 
    story.title = title
    story.content = content
            
    #commit the function 
    db.session.commit()
    return jsonify({"Success":f"Story was updated successfully"}),200

# Delete story only by the user 
@story_bp.route('/story/delete/<int:story_id>',methods=['DELETE']) 
@jwt_required()
def delete_story(story_id):
    current_user_id = get_jwt_identity()
    admin = Admin.query.get(current_user_id)
    if not admin: 
        return jsonify({"Error":"Cannot delete story/Unauthorized"}), 406 
    
    story=Story.query.get(story_id,)
    if not story:
        return jsonify({"Error": "Story not found"}), 404
    db.session.delete(story)
    db.session.commit()
    
    return jsonify({"Success":f"Story deleted Successfully"})

