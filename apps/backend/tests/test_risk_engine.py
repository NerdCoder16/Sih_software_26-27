import pytest
from app.services.risk_engine import risk_engine

def test_risk_engine_safe_baseline():
    score, level, factors, reason = risk_engine.calculate_risk(
        rainfall_intensity=10.0,
        cumulative_rainfall_24h=15.0,
        soil_saturation_pct=30.0,
        pore_pressure_kpa=10.0,
        slope_tilt_mm=0.5,
        terrain_baseline=10.0
    )
    assert 0.0 <= score <= 100.0
    assert level in ["SAFE", "LOW"]
    assert len(factors) == 4
    assert "Risk score is" in reason

def test_risk_engine_critical_threshold():
    score, level, factors, reason = risk_engine.calculate_risk(
        rainfall_intensity=180.0,
        cumulative_rainfall_24h=260.0,
        soil_saturation_pct=95.0,
        pore_pressure_kpa=80.0,
        slope_tilt_mm=30.0,
        terrain_baseline=80.0
    )
    assert score >= 80.0
    assert level == "CRITICAL"
    assert "Primary escalation driver is" in reason
