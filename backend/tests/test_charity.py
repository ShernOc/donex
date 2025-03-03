def test_get_all_charities(client, auth_headers_admin):
    response = client.get("/charities", headers=auth_headers_admin)
    assert response.status_code == 200
    assert len(response.json["charities"]) > 0

def test_get_charity_by_id(client, auth_headers_admin):
    response = client.get("/charities/1", headers=auth_headers_admin)
    assert response.status_code == 200
    assert response.json["charity_name"] == "Helping Hands"

def test_create_charity(client):
    response = client.post("/charity", json={
        "charity_name": "New Charity",
        "email": "newcharity@example.com",
        "password": "securepass",
        "description": "Helping those in need",
        "user_id": 2
    })
    assert response.status_code == 200
    assert response.json["success"] == "Charity added successfully"

def test_create_duplicate_charity(client):
    response = client.post("/charity", json={
        "charity_name": "Helping Hands",
        "email": "duplicate@example.com",
        "password": "password123",
        "description": "Duplicate charity",
        "user_id": 1
    })
    assert response.status_code == 406
    assert response.json["error"] == "Charity already exists"

def test_update_charity(client, auth_headers_admin):
    response = client.patch("/charities/update/1", headers=auth_headers_admin, json={
        "charity_name": "Updated Charity",
        "email": "updated@example.com",
        "description": "Updated description"
    })
    assert response.status_code == 200
    assert response.json["success"] == "Charity updated successfully"

def test_update_charity_unauthorized(client, auth_headers_user):
    response = client.patch("/charities/update/1", headers=auth_headers_user, json={
        "charity_name": "Unauthorized Update"
    })
    assert response.status_code == 403
    assert response.json["error"] == "Unauthorized to update this charity"

def test_delete_charity(client, auth_headers_admin):
    response = client.delete("/charity/delete/1", headers=auth_headers_admin)
    assert response.status_code == 200
    assert response.json["Success"] == "Charity deleted successfully"

def test_delete_charity_unauthorized(client, auth_headers_user):
    response = client.delete("/charity/delete/1", headers=auth_headers_user)
    assert response.status_code == 403
    assert response.json["Error"] == "Unauthorized to delete the charity"
