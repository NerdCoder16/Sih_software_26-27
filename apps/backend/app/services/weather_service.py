from datetime import datetime
from typing import Dict, Any

class WeatherProvider:
    def __init__(self, mode: str = "MOCK"):
        self.mode = mode

    def get_weather_observation(self, district: str) -> Dict[str, Any]:
        if self.mode == "LIVE":
            # Live provider placeholder when external API keys are attached
            return {
                "district": district,
                "status": "DATA SOURCE DEGRADED",
                "message": "Live weather API key unconfigured",
                "rainfall24h": 0.0,
                "intensity": 0.0,
                "timestamp": datetime.utcnow().isoformat(),
                "provider": "EXTERNAL_LIVE"
            }
        
        # Mock / Simulation default
        return {
            "district": district,
            "status": "ONLINE",
            "message": "Mock weather stream active",
            "rainfall24h": 142.5,
            "intensity": 18.5,
            "timestamp": datetime.utcnow().isoformat(),
            "provider": "NER_MET_STATION_SIM"
        }

weather_provider = WeatherProvider()
