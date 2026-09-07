from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_alerts():
    res = client.get("/api/v1/alerts")
    assert res.status_code == 200
    json_data = res.json()
    assert json_data["success"] is True

def test_acknowledge_alert():
    # First get an alert ID
    alerts_res = client.get("/api/v1/alerts")
    alerts = alerts_res.json()["data"]
    if len(alerts) > 0:
        alert_id = alerts[0]["id"]
        ack_res = client.post(f"/api/v1/alerts/{alert_id}/acknowledge")
        assert ack_res.status_code == 200
        assert ack_res.json()["data"]["status"] == "ACKNOWLEDGED"
