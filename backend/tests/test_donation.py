import pytest
from app import create_app, db
from models import Donation, User
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
def auth_headers(client):
    """Create a test user and return authentication headers."""
    test_user = User(email="test@example.com", password="hashedpassword", full_name="Test User")
    db.session.add(test_user)
    db.session.commit()

    access_token = create_access_token(identity=test_user.id)
    return {"Authorization": f"Bearer {access_token}"}

def test_get_donations_empty(client, auth_headers):
    """Test fetching donations when none exist."""
    response = client.get("/donations", headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert data["grand_total_donations"] == 0

def test_add_donation(client, auth_headers):
    """Test adding a donation."""
    donation_data = {
        "amount": 100,
        "donation_date": "2025-02-27",
        "user_id": 1,
        "charity_id": 1
    }
    response = client.post("/donations", json=donation_data, headers=auth_headers)
    assert response.status_code == 201
    assert response.get_json()["message"] == "Donation added successfully"

def test_get_donations_after_adding(client, auth_headers):
    """Test fetching donations after adding one."""
    donation = Donation(amount=50, donation_date="2025-02-27", user_id=1, charity_id=1)
    db.session.add(donation)
    db.session.commit()

    response = client.get("/donations", headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert data["grand_total_donations"] == 50

def test_update_donation(client, auth_headers):
    """Test updating an existing donation."""
    donation = Donation(amount=75, donation_date="2025-02-27", user_id=1, charity_id=1)
    db.session.add(donation)
    db.session.commit()

    update_data = {"amount": 150}
    response = client.put(f"/donations/{donation.id}", json=update_data, headers=auth_headers)
    assert response.status_code == 200
    assert response.get_json()["message"] == "Donation updated successfully"

    updated_donation = Donation.query.get(donation.id)
    assert updated_donation.amount == 150

def test_delete_donation(client, auth_headers):
    """Test deleting a donation."""
    donation = Donation(amount=200, donation_date="2025-02-27", user_id=1, charity_id=1)
    db.session.add(donation)
    db.session.commit()

    response = client.delete(f"/donations/{donation.id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.get_json()["message"] == "Donation deleted successfully"

    deleted_donation = Donation.query.get(donation.id)
    assert deleted_donation is None
