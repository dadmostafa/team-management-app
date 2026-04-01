from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def get_token(username, password):
    response = client.post("/login", data={
        "username": username,
        "password": password
    })
    return response.json()["access_token"]


# ─────────────────────────────────────────
# LOGIN TESTS
# ─────────────────────────────────────────
def test_login_admin_success():
    response = client.post("/login", data={
        "username": "admin",
        "password": "admin123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["role"] == "admin"

def test_login_viewer_success():
    response = client.post("/login", data={
        "username": "viewer",
        "password": "viewer123"
    })
    assert response.status_code == 200
    assert response.json()["role"] == "viewer"

def test_login_wrong_password():
    response = client.post("/login", data={
        "username": "admin",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

def test_login_wrong_username():
    response = client.post("/login", data={
        "username": "hacker",
        "password": "admin123"
    })
    assert response.status_code == 401


# ─────────────────────────────────────────
# TEAMS TESTS
# ─────────────────────────────────────────
def test_get_teams_with_valid_token():
    token = get_token("admin", "admin123")
    response = client.get("/teams", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200
    assert "teams" in response.json()

def test_get_teams_without_token():
    response = client.get("/teams")
    assert response.status_code == 401

def test_create_team_as_admin():
    token = get_token("admin", "admin123")
    response = client.post("/teams", json={
        "name": "TestTeam",
        "location": "New York",
        "members": 3,
        "lead": "Test Lead"
    }, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["message"] == "Team created successfully"

def test_create_team_as_viewer():
    token = get_token("viewer", "viewer123")
    response = client.post("/teams", json={
        "name": "TestTeam2",
        "location": "London",
        "members": 2,
        "lead": "Someone"
    }, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 403  # viewers cannot create teams

def test_delete_team_as_viewer():
    token = get_token("viewer", "viewer123")
    response = client.delete("/teams/Engineering", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 403  # viewers cannot delete teams


# ─────────────────────────────────────────
# MEMBERS TESTS
# ─────────────────────────────────────────
def test_add_member_as_admin():
    token = get_token("admin", "admin123")
    response = client.post("/teams/Engineering/members", json={
        "name": "Test Person",
        "role": "Developer",
        "location": "New York",
        "is_lead": False,
        "is_direct_staff": True
    }, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

def test_add_member_as_viewer():
    token = get_token("viewer", "viewer123")
    response = client.post("/teams/Engineering/members", json={
        "name": "Test Person",
        "role": "Developer",
        "location": "New York",
        "is_lead": False,
        "is_direct_staff": True
    }, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 403

def test_get_members_team_not_found():
    token = get_token("admin", "admin123")
    response = client.get("/teams/FakeTeamXYZ/members", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 404