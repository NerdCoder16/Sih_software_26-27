import asyncio
from datetime import datetime
from typing import Dict, Any, List

PHASES = [
    "NORMAL",
    "HEAVY_RAIN",
    "EXTREME_RAIN",
    "SOIL_SATURATION",
    "SLOPE_MOVEMENT",
    "MULTI_SENSOR_ANOMALY",
    "IMMINENT_LANDSLIDE",
    "LANDSLIDE_OCCURRED",
    "ROAD_BLOCKAGE",
    "FLASH_FLOOD",
    "RECOVERY"
]

class SimulationEngine:
    def __init__(self):
        self.is_active: bool = False
        self.is_paused: bool = False
        self.phase: str = "NORMAL"
        self.elapsed_seconds: int = 0
        self.speed: int = 1
        self.started_at: datetime = datetime.utcnow()

    def start(self):
        self.is_active = True
        self.is_paused = False
        self.started_at = datetime.utcnow()

    def pause(self):
        self.is_paused = True

    def resume(self):
        self.is_paused = True
        self.is_active = True

    def reset(self):
        self.is_active = False
        self.is_paused = False
        self.elapsed_seconds = 0
        self.phase = "NORMAL"

    def set_speed(self, speed: int):
        if speed in [1, 2, 5, 10, 50]:
            self.speed = speed

    def advance_phase(self, new_phase: str):
        if new_phase in PHASES:
            self.phase = new_phase

    def tick(self) -> Dict[str, Any]:
        if not self.is_active or self.is_paused:
            return self.get_state()

        self.elapsed_seconds += self.speed
        phase_idx = min(len(PHASES) - 1, self.elapsed_seconds // 30)
        self.phase = PHASES[phase_idx]

        return self.get_state()

    def _compute_world_state(self) -> Dict[str, Any]:
        p = self.phase
        t = self.elapsed_seconds

        # Environment deterministic progression
        if p == "NORMAL":
            rainfall, saturation, displacement, risk_score = 5, 35, 0.2, 25
            status_text = "Baseline weather monitoring. Conditions stable."
        elif p == "HEAVY_RAIN":
            rainfall, saturation, displacement, risk_score = 65, 52, 1.2, 48
            status_text = "Heavy rain across Sohra-Cherrapunji corridor (65mm/h)."
        elif p == "EXTREME_RAIN":
            rainfall, saturation, displacement, risk_score = 160, 74, 3.5, 64
            status_text = "Extreme rainfall exceeding 150mm/24h threshold."
        elif p == "SOIL_SATURATION":
            rainfall, saturation, displacement, risk_score = 195, 88, 6.8, 78
            status_text = "Soil saturation > 85%. Piezometer pore pressure critical."
        elif p == "SLOPE_MOVEMENT":
            rainfall, saturation, displacement, risk_score = 215, 94, 14.2, 86
            status_text = "Inclinometer S-01 detects 14.2mm movement on NH-40 slope."
        elif p == "MULTI_SENSOR_ANOMALY":
            rainfall, saturation, displacement, risk_score = 230, 96, 21.0, 90
            status_text = "Multi-sensor convergence. Field tension cracks confirmed."
        elif p == "IMMINENT_LANDSLIDE":
            rainfall, saturation, displacement, risk_score = 240, 98, 28.5, 96
            status_text = "Imminent slope failure! Emergency sirens activated."
        elif p == "LANDSLIDE_OCCURRED":
            rainfall, saturation, displacement, risk_score = 250, 100, 45.0, 100
            status_text = "Landslide occurred at NH-40 Corridor (91.7333, 25.2667)."
        elif p == "ROAD_BLOCKAGE":
            rainfall, saturation, displacement, risk_score = 210, 100, 46.5, 95
            status_text = "NH-40 Highway blocked. Evacuation rerouted via Jowai Bypass."
        elif p == "FLASH_FLOOD":
            rainfall, saturation, displacement, risk_score = 180, 95, 47.0, 88
            status_text = "Debris flow runoff. Active rescue operations underway."
        else: # RECOVERY
            rainfall, saturation, displacement, risk_score = 20, 72, 47.2, 38
            status_text = "Threat level decreasing. Damage assessment & recovery active."

        cum_rainfall = min(600, 12 + t * 3)

        return {
            "environment": {
                "rainfallRate": rainfall,
                "cumulativeRainfall": cum_rainfall,
                "rainfallAnomaly": max(0, int(((rainfall - 15) / 15) * 100)),
                "soilMoisture": int(saturation * 0.85),
                "soilSaturation": saturation,
                "surfaceMovement": displacement,
                "terrainStress": round(risk_score * 0.95, 1),
                "weatherCondition": "Severe Storm / Heavy Downpour" if rainfall > 50 else "Moderate Rain" if rainfall > 15 else "Clear / Light Drizzle",
                "statusText": status_text
            },
            "risk": {
                "sohraRiskScore": risk_score,
                "sohraRiskLevel": "CRITICAL" if risk_score >= 85 else "HIGH" if risk_score >= 60 else "MODERATE" if risk_score >= 40 else "LOW",
                "factors": [
                    {"type": "Rainfall Intensity", "value": rainfall, "threshold": 100, "contribution": min(45, int(rainfall * 0.2))},
                    {"type": "Soil Saturation", "value": saturation, "threshold": 85, "contribution": min(35, int(saturation * 0.35))},
                    {"type": "Slope Gradient", "value": 42, "threshold": 30, "contribution": 20},
                    {"type": "Historical Susceptibility", "value": 8.5, "threshold": 5, "contribution": 15}
                ]
            },
            "impact": {
                "affectedPopulation": 14500 if risk_score > 60 else 3200,
                "affectedRoads": ["NH-40 Highway Corridor"] if p in ["LANDSLIDE_OCCURRED", "ROAD_BLOCKAGE", "FLASH_FLOOD"] else [],
                "affectedInfrastructure": ["Power Line Pole #14", "Culvert Bridge B-2"] if risk_score > 80 else []
            },
            "response": {
                "roadStatus": "BLOCKED" if p in ["LANDSLIDE_OCCURRED", "ROAD_BLOCKAGE", "FLASH_FLOOD"] else "OPEN",
                "activeEvacRoute": "r2" if p in ["ROAD_BLOCKAGE", "FLASH_FLOOD", "RECOVERY"] else "r1",
                "shelterOccupancy": 380 if p in ["FLASH_FLOOD", "RECOVERY"] else 260 if p in ["ROAD_BLOCKAGE", "LANDSLIDE_OCCURRED"] else 120,
                "resourceStatus": "ON_SCENE" if p in ["FLASH_FLOOD", "RECOVERY"] else "EN_ROUTE" if p in ["ROAD_BLOCKAGE", "LANDSLIDE_OCCURRED"] else "DISPATCHED" if p == "IMMINENT_LANDSLIDE" else "AVAILABLE"
            }
        }

    def get_state(self) -> Dict[str, Any]:
        world = self._compute_world_state()
        hours = self.elapsed_seconds // 3600
        mins = (self.elapsed_seconds % 3600) // 60
        secs = self.elapsed_seconds % 60
        time_str = f"T+{hours:02d}:{mins:02d}:{secs:02d}"

        return {
            "isActive": self.is_active,
            "isPaused": self.is_paused,
            "phase": self.phase,
            "elapsedSeconds": self.elapsed_seconds,
            "speed": self.speed,
            "currentTime": time_str,
            "startedAt": self.started_at.isoformat(),
            "progress": round((self.elapsed_seconds / 330) * 100, 1),
            "world": world
        }

backend_simulation_engine = SimulationEngine()
