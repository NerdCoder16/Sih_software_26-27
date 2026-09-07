from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_shelters():
    res = client.get("/api/v1/shelters")
    assert res.status_code == 200
    shelters = res.json()["data"]
    assert len(shelters) > 0
    assert shelters[0]["currentOccupancy"] <= shelters[0]["capacity"]

def test_evacuation_routes():
    res = client.get("/api/v1/evacuation-routes")
    assert res.status_code == 200
    routes = res.json()["data"]
    assert len(routes) > 0
