from fastapi.testclient import TestClient
from app.main import app
from app.services.weather_service import WeatherProvider

client = TestClient(app)

def test_degraded_weather_provider():
    provider = WeatherProvider(mode="LIVE")
    obs = provider.get_weather_observation("East Khasi Hills")
    assert obs["status"] == "DATA SOURCE DEGRADED"
    assert "unconfigured" in obs["message"].lower()

def test_weather_endpoint():
    res = client.get("/api/v1/weather?district=East Khasi Hills")
    assert res.status_code == 200
    json_data = res.json()
    assert json_data["success"] is True
    assert "district" in json_data["data"]
