from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_end_to_end_disaster_pipeline():
    # 1. Post Critical Sensor Telemetry
    sensor_res = client.post("/api/v1/sensors/readings", json={
        "sensorId": "s3",
        "value": 190.0,
        "unit": "mm",
        "isAnomaly": True,
        "quality": 0.98
    })
    assert sensor_res.status_code == 200
    sensor_data = sensor_res.json()["data"]
    assert sensor_data["riskScore"] >= 70.0

    # 2. Check Alerts Generated
    alerts_res = client.get("/api/v1/alerts")
    assert alerts_res.status_code == 200
    alerts = alerts_res.json()["data"]
    assert len(alerts) > 0

    # 3. Create Incident Report
    inc_res = client.post("/api/v1/incidents", json={
        "title": "E2E Test Slope Failure",
        "description": "Mass movement detected on Sohra slope",
        "severity": "CATASTROPHIC",
        "zoneId": "z1",
        "coordinates": [91.7333, 25.2667],
        "populationAffected": 3000,
        "roadsAffected": 2
    })
    assert inc_res.status_code == 200
    inc_data = inc_res.json()["data"]
    inc_id = inc_data["id"]

    # 4. Transition Incident to VERIFIED
    trans_res = client.post(f"/api/v1/incidents/{inc_id}/transition", json={
        "stage": "VERIFIED",
        "actor": "District Magistrate"
    })
    assert trans_res.status_code == 200

    # 5. Dispatch Resource
    resources_res = client.get("/api/v1/resources")
    resources = resources_res.json()["data"]
    resource_id = resources[0]["id"]

    dispatch_res = client.post(f"/api/v1/resources/{resource_id}/dispatch", json={
        "resourceId": resource_id,
        "incidentId": inc_id
    })
    assert dispatch_res.status_code == 200
    assert dispatch_res.json()["data"]["status"] == "DISPATCHED"

    # 6. Verify Evacuation Routes & Shelters
    shelters_res = client.get("/api/v1/shelters")
    assert shelters_res.status_code == 200

    routes_res = client.get("/api/v1/evacuation-routes")
    assert routes_res.status_code == 200

    # 7. Transition Incident to CLOSED (Recovery Complete)
    close_res = client.post(f"/api/v1/incidents/{inc_id}/transition", json={
        "stage": "CLOSED",
        "actor": "Emergency Officer"
    })
    assert close_res.status_code == 200
    assert close_res.json()["data"]["status"] == "CLOSED"
