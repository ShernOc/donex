from flask import jsonify, request, Blueprint
from models import db, Story
from datetime import datetime

story_bp = Blueprint("story_bp",__name__)
