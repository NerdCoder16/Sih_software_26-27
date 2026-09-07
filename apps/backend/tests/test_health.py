from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    json_data = res.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) >= 9
    services = [s["name"] for s in json_data["data"]]
    assert "DATABASE" in services
    assert "WEATHER" in services
    assert "WEBSOCKET" in services
