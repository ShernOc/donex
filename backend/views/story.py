from flask import jsonify, request, Blueprint
from models import db, Story, User
from flask_jwt_extended import jwt_required, get_jwt_identity

story_bp = Blueprint("story_bp", __name__)

#Get all stories:
@story_bp.route("/stories", methods = ['GET'])
def get_story():
    stories= Story.query.all()    
    return jsonify([{ 
            "id": story.id,
            "title":story.title,
            "content":story.content,
            "user_id":story.user_id
            }for story in stories]), 200
    
# get story by id
@story_bp.route("/stories/<int:user_id>", methods=["GET"])
def story_by_id(user_id):
    story = Story.query.get_or_404(user_id)
    return jsonify({"id": story.id, "title": story.title, "content": story.content,"user_id":story.user_id})


#Create a story by admin
@story_bp.route('/stories', methods =["POST"])
@jwt_required()
def post_story():
    current_user_id = get_jwt_identity()
    #fetch the admin
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"Error":"Only admins can post stories"}), 403
    
    data = request.get_json()
    title = data.get("title")
    content = data.get("content")
    user_id = data.get("user_id")

    #Check if the tittle already exist
    check_title = Story.query.filter(title==title).first()
    check_content = Story.query.filter(content==content).first()

    if check_title and check_content:
        return jsonify({"Error":"The story already exist or has been posted"}), 406
   
    #create a new story
    new_story =Story(title=title, user_id=current_user_id, content=content)
    
    #call the function 
    db.session.add(new_story)
    db.session.commit()
    return jsonify({"Success":"Story added successfully"}), 200
      
#Update a Story
@story_bp.route('/stories/update/<int:story_id>', methods =["PATCH"])
@jwt_required()
def update_story_id(story_id):
    current_user_id = get_jwt_identity()
    
    if not current_user_id:
        return jsonify({"Error":"Not authorized to update the story"}), 404
    
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
@story_bp.route('/stories/delete/<int:story_id>', methods=['DELETE']) 
@jwt_required()
def delete_story(story_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(id=current_user_id)
    if not user: 
        return jsonify({"Error":"Cannot delete story/Unauthorized"}), 406 
    
    story=Story.query.get(story_id)
    if not story:
        return jsonify({"Error": "Story not found"}), 404
    
    db.session.delete(story)
    db.session.commit()
    
    return jsonify({"Success":f"Story deleted Successfully"})


# @story_bp.route('/stories/delete_all', methods=['DELETE'])
# @jwt_required()
# def delete_all_stories():
#     current_user_id =get_jwt_identity()
    
#     if not current_user_id:
#         return jsonify({"error": "Not authorized to delete this donation"}), 403
    
#     Story.query.delete()
#     db.session.commit()
#     return jsonify({"message": "All stories deleted successfully"}), 200
