from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from app.db.models import RiskLevel

class SensorBase(BaseModel):
    id: str
    type: str
    status: str
    value: float
    zone_id: str

class SensorCreate(SensorBase):
    pass

class Sensor(SensorBase):
    model_config = ConfigDict(from_attributes=True)
