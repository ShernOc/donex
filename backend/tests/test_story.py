import pytest
from app import create_app, db
from models import Story, User
from flask_jwt_extended import create_access_token

@pytest.fixture
def client():
    """Set up test Flask app and database."""
    app = create_app("testing")  # Ensure your config has a "testing" mode
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config["JWT_SECRET_KEY"] = "testsecret"

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()

@pytest.fixture
def admin_headers(client):
    """Create an admin user and return authentication headers."""
    admin_user = User(email="admin@example.com", password="hashedpassword", full_name="Admin User")
    db.session.add(admin_user)
    db.session.commit()

    access_token = create_access_token(identity=admin_user.id)
    return {"Authorization": f"Bearer {access_token}"}

@pytest.fixture
def user_headers(client):
    """Create a normal user and return authentication headers."""
    normal_user = User(email="user@example.com", password="hashedpassword", full_name="Normal User")
    db.session.add(normal_user)
    db.session.commit()

    access_token = create_access_token(identity=normal_user.id)
    return {"Authorization": f"Bearer {access_token}"}

def test_get_stories_empty(client):
    """Test fetching stories when none exist."""
    response = client.get("/stories")
    assert response.status_code == 200
    assert response.get_json() == []

def test_post_story_admin(client, admin_headers):
    """Test that an admin can post a story."""
    story_data = {"title": "Test Story", "content": "This is a test story."}
    response = client.post("/story", json=story_data, headers=admin_headers)
    assert response.status_code == 200
    assert response.get_json()["Success"] == "Story added successfully"

def test_post_story_duplicate(client, admin_headers):
    """Test posting a duplicate story (same title and content) is not allowed."""
    story_data = {"title": "Duplicate Story", "content": "This story already exists."}
    client.post("/story", json=story_data, headers=admin_headers)  # First post

    response = client.post("/story", json=story_data, headers=admin_headers)  # Duplicate
    assert response.status_code == 406
    assert "The story already exist or has been posted" in response.get_json()["Error"]

def test_update_story(client, admin_headers):
    """Test updating a story."""
    story = Story(title="Old Title", content="Old content", user_id=1)
    db.session.add(story)
    db.session.commit()

    update_data = {"title": "New Title", "content": "Updated content"}
    response = client.patch(f"/stories/update/{story.id}", json=update_data, headers=admin_headers)
    assert response.status_code == 200
    assert response.get_json()["Success"] == "Story was updated successfully"

    updated_story = Story.query.get(story.id)
    assert updated_story.title == "New Title"
    assert updated_story.content == "Updated content"

def test_delete_story(client, admin_headers):
    """Test deleting a story."""
    story = Story(title="Delete Story", content="Content to delete", user_id=1)
    db.session.add(story)
    db.session.commit()

    response = client.delete(f"/stories/delete/{story.id}", headers=admin_headers)
    assert response.status_code == 200
    assert response.get_json()["Success"] == "Story deleted Successfully"

    deleted_story = Story.query.get(story.id)
    assert deleted_story is None
