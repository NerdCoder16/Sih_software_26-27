from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_sensor_ingestion_valid():
    res = client.post("/api/v1/sensors/readings", json={
        "sensorId": "s1",
        "value": 145.0,
        "unit": "mm",
        "isAnomaly": False
    })
    assert res.status_code == 200
    json_data = res.json()
    assert json_data["success"] is True
    assert "readingId" in json_data["data"]

def test_sensor_ingestion_unknown_sensor():
    res = client.post("/api/v1/sensors/readings", json={
        "sensorId": "unknown-sensor-999",
        "value": 50.0,
        "unit": "mm"
    })
    assert res.status_code == 404
