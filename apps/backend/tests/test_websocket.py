from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_websocket_real_connection():
    with client.websocket_connect("/ws/live?token=test") as websocket:
        # Trigger sensor reading via HTTP REST which broadcasts SENSOR_READING via WebSocket
        res = client.post("/api/v1/sensors/readings", json={
            "sensorId": "s1",
            "value": 185.0,
            "unit": "mm",
            "isAnomaly": True
        })
        assert res.status_code == 200

        # Receive real WebSocket broadcast payload
        data = websocket.receive_json()
        assert "type" in data
        assert data["type"] in ["SENSOR_READING", "RISK_UPDATE", "ALERT_CREATED"]
