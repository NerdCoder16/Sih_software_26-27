from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_field_reports_flow():
    # 1. Create Report
    res = client.post("/api/v1/field-reports", json={
        "type": "DAMAGE_ASSESSMENT",
        "description": "Road slump observed on NH-40 Corridor",
        "reportedBy": "Field Officer Sangma",
        "coordinates": [91.8667, 25.9000],
        "severity": 4
    })
    assert res.status_code == 200
    report_data = res.json()["data"]
    assert report_data["syncStatus"] == "SYNCED"

    # 2. Get Reports
    get_res = client.get("/api/v1/field-reports")
    assert get_res.status_code == 200
    reports = get_res.json()["data"]
    assert len(reports) >= 1
