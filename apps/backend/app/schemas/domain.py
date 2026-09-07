from datetime import datetime
from typing import List, Optional, Tuple, Any, Dict
from pydantic import BaseModel, Field

# Coordinates as [longitude, latitude]
Coordinates = Tuple[float, float]

class RiskFactorSchema(BaseModel):
    type: str
    value: float
    threshold: float
    contribution: float

class RiskZoneSchema(BaseModel):
    id: str
    name: str
    district: str
    coordinates: List[float]
    polygon: List[List[float]]
    currentRiskLevel: str
    riskScore: float
    confidence: Optional[float] = 90.0
    trend: Optional[str] = "stable"
    factors: List[RiskFactorSchema] = []
    populationAtRisk: int = 0
    roadsAtRisk: Optional[int] = 0
    lastUpdated: datetime = Field(default_factory=datetime.utcnow)
    isDemo: Optional[bool] = True

class RiskHistorySchema(BaseModel):
    zoneId: str
    timestamp: datetime
    riskScore: float
    riskLevel: str

class SensorReadingSchema(BaseModel):
    id: str
    sensorId: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    value: float
    unit: str
    isAnomaly: bool = False
    quality: Optional[float] = 1.0

class SensorReadingCreateSchema(BaseModel):
    sensorId: str
    timestamp: Optional[datetime] = None
    value: float
    unit: str
    isAnomaly: Optional[bool] = False
    quality: Optional[float] = 1.0

class SensorSchema(BaseModel):
    id: str
    zoneId: str
    type: str
    name: str
    coordinates: List[float]
    status: str = "ACTIVE"
    installationDate: datetime = Field(default_factory=datetime.utcnow)
    lastMaintenance: Optional[datetime] = None
    batteryLevel: Optional[float] = 100.0
    lastReading: Optional[SensorReadingSchema] = None
    isDemo: Optional[bool] = True

class AlertSchema(BaseModel):
    id: str
    title: str
    description: str
    severity: str
    status: str = "ACTIVE"
    zoneId: Optional[str] = None
    source: str = "Automated Engine"
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    expiresAt: Optional[datetime] = None
    acknowledgedBy: Optional[str] = None
    acknowledgedAt: Optional[datetime] = None
    actions: List[str] = []
    isDemo: Optional[bool] = True

class AlertCreateSchema(BaseModel):
    title: str
    description: str
    severity: str
    zoneId: Optional[str] = None
    source: Optional[str] = "Manual Entry"

class IncidentEventSchema(BaseModel):
    id: str
    incidentId: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    description: str
    recordedBy: str
    type: Optional[str] = "LOG"

class IncidentSchema(BaseModel):
    id: str
    title: str
    description: str
    severity: str
    status: str = "REPORTED"
    zoneId: str
    coordinates: List[float]
    reportedAt: datetime = Field(default_factory=datetime.utcnow)
    verifiedAt: Optional[datetime] = None
    declaredAt: Optional[datetime] = None
    closedAt: Optional[datetime] = None
    casualties: int = 0
    injuries: int = 0
    structuresDamaged: int = 0
    populationAffected: Optional[int] = 0
    roadsAffected: Optional[int] = 0
    priorityScore: Optional[float] = 50.0
    priorityFactors: List[str] = []
    timeline: List[IncidentEventSchema] = []
    assignedResources: List[str] = []
    isDemo: Optional[bool] = True

class IncidentCreateSchema(BaseModel):
    title: str
    description: str
    severity: str
    zoneId: str
    coordinates: List[float]
    populationAffected: Optional[int] = 0
    roadsAffected: Optional[int] = 0

class ResourceSchema(BaseModel):
    id: str
    name: str
    type: str
    status: str = "AVAILABLE"
    location: List[float]
    assignedIncidentId: Optional[str] = None
    capacity: int = 10
    eta: Optional[int] = None
    district: Optional[str] = None
    contactPerson: str = "Dispatcher"
    contactPhone: str = "+91-1070"
    isDemo: Optional[bool] = True

class ResourceDispatchSchema(BaseModel):
    resourceId: str
    incidentId: str

class ShelterSchema(BaseModel):
    id: str
    name: str
    district: str
    coordinates: List[float]
    capacity: int
    currentOccupancy: int = 0
    availableCapacity: Optional[int] = None
    facilities: List[str] = []
    contactPerson: str = "Manager"
    contactPhone: str = "+91-1070"
    isDemo: Optional[bool] = True

class EvacuationRouteSchema(BaseModel):
    id: str
    name: str
    originZoneId: str
    destinationShelterId: str
    path: List[List[float]] = []
    estimatedTimeMinutes: int = 30
    distance: Optional[float] = 12.0
    isSafe: bool = True
    status: Optional[str] = "active"
    riskLevel: Optional[str] = "LOW"
    blockages: List[List[float]] = []
    roadCondition: Optional[str] = "Clear"
    isDemo: Optional[bool] = True

class FieldReportSchema(BaseModel):
    id: str
    incidentId: Optional[str] = None
    type: str
    description: str
    reportedBy: str
    coordinates: List[float]
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    severity: Optional[int] = 3
    syncStatus: str = "SYNCED"
    isDemo: Optional[bool] = True

class FieldReportCreateSchema(BaseModel):
    incidentId: Optional[str] = None
    type: str
    description: str
    reportedBy: str
    coordinates: List[float]
    severity: Optional[int] = 3

class ServiceHealthSchema(BaseModel):
    name: str
    status: str
    latencyMs: float
    lastChecked: datetime = Field(default_factory=datetime.utcnow)
    message: Optional[str] = None

class SimulationStateSchema(BaseModel):
    isActive: bool = False
    isPaused: Optional[bool] = False
    phase: str = "NORMAL"
    elapsedSeconds: int = 0
    speed: int = 1
    startedAt: Optional[datetime] = None
    progress: Optional[float] = 0.0

class ApiResponse(BaseModel):
    success: bool = True
    data: Any
    message: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
