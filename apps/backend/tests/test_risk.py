from fastapi.testclient import TestClient
from app.main import app
from app.services.risk_engine import risk_engine

client = TestClient(app)

def test_risk_api_endpoint():
    res = client.get("/api/v1/risk")
    assert res.status_code == 200
    json_data = res.json()
    assert json_data["success"] is True
    assert "highestRiskZone" in json_data["data"]

def test_risk_engine_explainability():
    score, level, factors, reason = risk_engine.calculate_risk(
        rainfall_intensity=120.0,
        cumulative_rainfall_24h=180.0,
        soil_saturation_pct=88.0,
        pore_pressure_kpa=45.0,
        slope_tilt_mm=12.0
    )
    assert 0.0 <= score <= 100.0
    assert level in ["HIGH", "CRITICAL"]
    assert len(factors) == 4
    assert "Rainfall Intensity" in [f.type for f in factors]
