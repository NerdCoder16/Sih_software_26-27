import asyncio
from datetime import datetime
from typing import Dict, Any, List
from app.realtime.manager import manager

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
        self._task: asyncio.Task = None

    def start(self):
        self.is_active = True
        self.is_paused = False
        self.elapsed_seconds = 0
        self.phase = "NORMAL"
        self.started_at = datetime.utcnow()

    def pause(self):
        self.is_paused = True

    def resume(self):
        self.is_paused = False
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

        # Auto-advance phase based on elapsed seconds if running continuously
        phase_idx = min(len(PHASES) - 1, self.elapsed_seconds // 30)
        self.phase = PHASES[phase_idx]

        return self.get_state()

    def get_state(self) -> Dict[str, Any]:
        return {
            "isActive": self.is_active,
            "isPaused": self.is_paused,
            "phase": self.phase,
            "elapsedSeconds": self.elapsed_seconds,
            "speed": self.speed,
            "startedAt": self.started_at.isoformat(),
            "progress": round((self.elapsed_seconds / 330) * 100, 1)
        }

backend_simulation_engine = SimulationEngine()
