def test_login_success(client):
    response = client.post("/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json

def test_login_failure(client):
    response = client.post("/login", json={
        "email": "wrong@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    assert response.json["msg"] == "Invalid email or password"

def test_login_missing_fields(client):
    response = client.post("/login", json={})
    assert response.status_code == 400
    assert response.json["error"] == "Email and password required"

def test_get_current_user(client, auth_headers):
    response = client.get("/current_user", headers=auth_headers)
    assert response.status_code == 200
    assert response.json["email"] == "test@example.com"

def test_get_current_user_unauthorized(client):
    response = client.get("/current_user")
    assert response.status_code == 401

def test_logout(client, auth_headers):
    response = client.delete("/logout", headers=auth_headers)
    assert response.status_code == 200
    assert response.json["Success"] == "Logged out successfully"
