from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_resource_dispatch():
    # Fetch resources
    res = client.get("/api/v1/resources")
    assert res.status_code == 200
    resources = res.json()["data"]
    assert len(resources) > 0

    target = resources[0]
    dispatch_res = client.post(f"/api/v1/resources/{target['id']}/dispatch", json={
        "resourceId": target["id"],
        "incidentId": "inc-1"
    })
    assert dispatch_res.status_code == 200
    assert dispatch_res.json()["data"]["status"] == "DISPATCHED"
