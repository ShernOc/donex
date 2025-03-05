import pytest
from backend.app import app, db
from backend.models import User, TokenBlocklist
from werkzeug.security import generate_password_hash
from flask_jwt_extended import create_access_token

@pytest.fixture(scope="session")
def test_app():
    """Create a test instance of the app with a test database."""
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config["JWT_SECRET_KEY"] = "testsecret"
    app.config["WTF_CSRF_ENABLED"] = False  # Disable CSRF for testing

    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()


@pytest.fixture(scope="function")
def client(test_app):
    """Create a new test client with an isolated database session."""
    with test_app.test_client() as client:
        with test_app.app_context():
            yield client


@pytest.fixture(scope="function")
def create_user():
    """Helper function to create a user with a specific role."""
    def _create_user(email="test@example.com", password="password123", role="user"):
        user = User(
            email=email,
            password=generate_password_hash(password),
            full_name="Test User",
            role=role
        )
        db.session.add(user)
        db.session.commit()
        return user
    return _create_user


@pytest.fixture
def auth_headers(client, create_user):
    """Returns authentication headers for a test user."""
    create_user()  # Create default test user
    response = client.post("/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    
    if response.status_code == 200 and "access_token" in response.json:
        access_token = response.json["access_token"]
        return {"Authorization": f"Bearer {access_token}"}
    
    pytest.fail("Authentication failed: check login endpoint and user setup.")


@pytest.fixture
def auth_headers_admin(client, create_user):
    """Returns authentication headers for an admin user."""
    create_user(email="admin@example.com", password="adminpass", role="admin")
    response = client.post("/login", json={
        "email": "admin@example.com",
        "password": "adminpass"
    })
    
    if response.status_code == 200 and "access_token" in response.json:
        access_token = response.json["access_token"]
        return {"Authorization": f"Bearer {access_token}"}
    
    pytest.fail("Admin authentication failed: check login endpoint and user setup.")
