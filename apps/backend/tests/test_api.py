import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    res = client.get("/")
    assert res.status_code == 200
    json_data = res.json()
    assert json_data["status"] == "ONLINE"

def test_get_zones():
    res = client.get("/api/v1/zones")
    assert res.status_code == 200
    json_data = res.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) >= 1
    assert "Sohra" in json_data["data"][0]["name"] or "Risk" in json_data["data"][0]["name"]

def test_get_sensors():
    res = client.get("/api/v1/sensors")
    assert res.status_code == 200
    json_data = res.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) >= 1

def test_get_alerts():
    res = client.get("/api/v1/alerts")
    assert res.status_code == 200
    json_data = res.json()
    assert json_data["success"] is True

def test_get_incidents():
    res = client.get("/api/v1/incidents")
    assert res.status_code == 200
    json_data = res.json()
    assert json_data["success"] is True

def test_get_health():
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    json_data = res.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) == 9
