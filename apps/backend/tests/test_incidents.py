from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_incident_lifecycle():
    # 1. Create Incident
    create_res = client.post("/api/v1/incidents", json={
        "title": "Test Debris Slump on Highway",
        "description": "Minor slope displacement observed",
        "severity": "MAJOR",
        "zoneId": "z1",
        "coordinates": [91.7333, 25.2667],
        "populationAffected": 500,
        "roadsAffected": 1
    })
    assert create_res.status_code == 200
    inc_data = create_res.json()["data"]
    inc_id = inc_data["id"]
    assert inc_data["status"] == "REPORTED"

    # 2. Valid Transition -> VERIFIED
    trans_res = client.post(f"/api/v1/incidents/{inc_id}/transition", json={
        "stage": "VERIFIED",
        "actor": "District Magistrate"
    })
    assert trans_res.status_code == 200
    assert trans_res.json()["data"]["status"] == "VERIFIED"

    # 3. Invalid Stage Transition -> 400 Bad Request
    invalid_res = client.post(f"/api/v1/incidents/{inc_id}/transition", json={
        "stage": "INVALID_STAGE_NAME",
        "actor": "Admin"
    })
    assert invalid_res.status_code == 400
