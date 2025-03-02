import pytest
from app import create_app, db
from models import User
from werkzeug.security import generate_password_hash
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
    admin_user = User(email="admin@example.com", password=generate_password_hash("password"), full_name="Admin User", role="admin")
    db.session.add(admin_user)
    db.session.commit()

    access_token = create_access_token(identity=admin_user.id)
    return {"Authorization": f"Bearer {access_token}"}

@pytest.fixture
def user_headers(client):
    """Create a normal user and return authentication headers."""
    normal_user = User(email="user@example.com", password=generate_password_hash("password"), full_name="Normal User", role="user")
    db.session.add(normal_user)
    db.session.commit()

    access_token = create_access_token(identity=normal_user.id)
    return {"Authorization": f"Bearer {access_token}"}

def test_register_user(client):
    """Test user registration."""
    data = {"full_name": "Test User", "email": "test@example.com", "password": "securepassword"}
    response = client.post("/register", json=data)
    
    assert response.status_code == 201
    assert response.get_json()["msg"] == "User created successfully"

def test_register_duplicate_email(client):
    """Test registering with an existing email."""
    data = {"full_name": "Duplicate User", "email": "test@example.com", "password": "securepassword"}
    client.post("/register", json=data)  # First registration
    
    response = client.post("/register", json=data)  # Duplicate registration
    assert response.status_code == 409
    assert response.get_json()["msg"] == "Email already registered"

def test_get_all_users(client, admin_headers):
    """Test fetching all users."""
    response = client.get("/user", headers=admin_headers)
    
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)

def test_get_user_by_id(client, admin_headers):
    """Test fetching a user by ID."""
    user = User(full_name="Sample User", email="sample@example.com", password="hashedpassword")
    db.session.add(user)
    db.session.commit()

    response = client.get(f"/user/{user.id}", headers=admin_headers)
    
    assert response.status_code == 200
    assert response.get_json()["email"] == "sample@example.com"

def test_update_user(client, user_headers):
    """Test updating user details."""
    user = User(full_name="Old Name", email="update@example.com", password="hashedpassword", role="user")
    db.session.add(user)
    db.session.commit()

    update_data = {"full_name": "New Name"}
    response = client.patch(f"/user/{user.id}", json=update_data, headers=user_headers)
    
    assert response.status_code == 200
    assert response.get_json()["msg"] == "user updated successfully"

    updated_user = User.query.get(user.id)
    assert updated_user.full_name == "New Name"

def test_update_user_unauthorized(client, user_headers):
    """Test unauthorized user update attempt."""
    user = User(full_name="Target User", email="target@example.com", password="hashedpassword")
    db.session.add(user)
    db.session.commit()

    update_data = {"full_name": "Hacker Name"}
    response = client.patch(f"/user/{user.id}", json=update_data, headers=user_headers)
    
    assert response.status_code == 403
    assert response.get_json()["error"] == "denied to update user"

def test_delete_user(client, user_headers):
    """Test user deleting their own account."""
    user = User(full_name="To Delete", email="delete@example.com", password="hashedpassword")
    db.session.add(user)
    db.session.commit()

    response = client.delete(f"/user/delete/{user.id}", headers=user_headers)
    
    assert response.status_code == 200
    assert response.get_json()["msg"] == "User deleted successfully"

    deleted_user = User.query.get(user.id)
    assert deleted_user is None

def test_admin_delete_user(client, admin_headers):
    """Test admin deleting a user."""
    user = User(full_name="To Delete", email="delete@example.com", password="hashedpassword")
    db.session.add(user)
    db.session.commit()

    response = client.delete(f"/user/delete/{user.id}", headers=admin_headers)
    
    assert response.status_code == 200
    assert response.get_json()["msg"] == "User deleted successfully"

    deleted_user = User.query.get(user.id)
    assert deleted_user is None
