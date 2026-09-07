// ============================================================
// NER Landslide EWRS — Shared Frontend Types
// ============================================================

export type OperatingMode = 'LIVE' | 'DEMO';
export type Coordinates = [number, number]; // [longitude, latitude]
export type District = string;

// ============================================================
// Risk Types
// ============================================================
export type RiskLevel = 'SAFE' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface RiskFactor {
  type: string;
  value: number;
  threshold: number;
  contribution: number;
}

export interface RiskZone {
  id: string;
  name: string;
  district: District;
  coordinates: Coordinates;
  polygon: Coordinates[];
  currentRiskLevel: RiskLevel;
  riskScore: number;
  confidence?: number;
  trend?: 'rising' | 'falling' | 'stable';
  factors: RiskFactor[];
  populationAtRisk: number;
  roadsAtRisk?: number;
  lastUpdated: Date;
  source?: string;
}

export interface RiskHistory {
  zoneId: string;
  timestamp: Date;
  riskScore: number;
  riskLevel: RiskLevel;
}

// ============================================================
// Sensor Types
// ============================================================
export type SensorType =
  | 'RAIN_GAUGE'
  | 'SOIL_MOISTURE'
  | 'INCLINOMETER'
  | 'PIEZOMETER'
  | 'GPS_STATION'
  | 'ACCELEROMETER'
  | 'CRACK_METER'
  | 'WEATHER_STATION'
  | 'EXTENSOMETER'
  | 'TILT_METER';

export type SensorStatus = 'ACTIVE' | 'ONLINE' | 'OFFLINE' | 'DEGRADED' | 'MAINTENANCE' | 'FAULT' | 'UNKNOWN';

export interface Sensor {
  id: string;
  zoneId: string;
  type: SensorType;
  name: string;
  coordinates: Coordinates;
  status: SensorStatus;
  installationDate: Date;
  lastMaintenance?: Date;
  batteryLevel?: number;
  lastReading?: SensorReading;
}

export interface SensorReading {
  id: string;
  sensorId: string;
  timestamp: Date;
  value: number;
  unit: string;
  isAnomaly: boolean;
  quality?: number;
}

// ============================================================
// Weather Types
// ============================================================
export interface RainfallData {
  timestamp: Date;
  amountMm: number;
  intensityMmPerHour: number;
}

export interface WeatherStation {
  id: string;
  name: string;
  coordinates: Coordinates;
  currentRainfall: RainfallData;
  forecast: string;
}

// ============================================================
// Alert Types
// ============================================================
export type AlertSeverity = 'INFO' | 'WATCH' | 'WARNING' | 'CRITICAL' | 'SYSTEM';

export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'EXPIRED';

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  zoneId?: string;
  source: string;
  timestamp: Date;
  expiresAt?: Date;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  actions?: string[];
}

// ============================================================
// Incident Types
// ============================================================
export type IncidentSeverity = 'MINOR' | 'MODERATE' | 'MAJOR' | 'SEVERE' | 'CATASTROPHIC';

export type IncidentStatus =
  | 'DETECTED'
  | 'ASSESSING'
  | 'REPORTED'
  | 'VERIFIED'
  | 'DECLARED'
  | 'RESPONDING'
  | 'EVACUATING'
  | 'RESCUE'
  | 'CONTAINED'
  | 'RECOVERY'
  | 'CLOSED';

export interface IncidentEvent {
  id: string;
  incidentId: string;
  timestamp: Date;
  description: string;
  recordedBy: string;
  type?: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  zoneId: string;
  coordinates: Coordinates;
  reportedAt: Date;
  verifiedAt?: Date;
  declaredAt?: Date;
  closedAt?: Date;
  casualties: number;
  injuries: number;
  structuresDamaged: number;
  populationAffected?: number;
  roadsAffected?: number;
  priorityScore?: number;
  priorityFactors?: string[];
  timeline?: IncidentEvent[];
  assignedResources?: string[];
  fieldReports?: string[];
}

// ============================================================
// Field Types
// ============================================================
export type FieldReportType =
  | 'OBSERVATION'
  | 'DAMAGE_ASSESSMENT'
  | 'RESOURCE_REQUEST'
  | 'CRACK'
  | 'GROUND_MOVEMENT'
  | 'LANDSLIDE'
  | 'ROAD_BLOCKAGE'
  | 'FLOOD'
  | 'DRAINAGE_FAILURE'
  | 'OTHER';

export type SyncStatus = 'PENDING' | 'SYNCED' | 'FAILED' | 'OFFLINE';

export interface MediaAttachment {
  id: string;
  url: string;
  thumbnailUrl?: string;
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  timestamp: Date;
  capturedAt?: Date;
}

export interface FieldReport {
  id: string;
  incidentId?: string;
  type: FieldReportType;
  description: string;
  reportedBy: string;
  coordinates: Coordinates;
  timestamp: Date;
  severity?: number;
  attachments: MediaAttachment[];
  syncStatus: SyncStatus;
  verifiedAt?: Date;
  verifiedBy?: string;
}

// ============================================================
// Resource Types
// ============================================================
export type ResourceType =
  | 'RESCUE_TEAM'
  | 'AMBULANCE'
  | 'POLICE'
  | 'FIRE'
  | 'SDRF'
  | 'NDRF'
  | 'EXCAVATOR'
  | 'DRONE'
  | 'MEDICAL_TEAM'
  | 'HEAVY_MACHINERY'
  | 'RELIEF_SUPPLIES'
  | 'VEHICLE';

export type ResourceStatus = 'AVAILABLE' | 'DISPATCHED' | 'EN_ROUTE' | 'ON_SCENE' | 'BUSY' | 'UNAVAILABLE' | 'OUT_OF_SERVICE';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  status: ResourceStatus;
  location: Coordinates;
  assignedIncidentId?: string;
  capacity: number;
  eta?: number;
  district?: string;
  contactPerson: string;
  contactPhone: string;
}

// ============================================================
// Evacuation Types
// ============================================================
export interface EvacuationRoute {
  id: string;
  name: string;
  originZoneId: string;
  destinationShelterId: string;
  path: Coordinates[];
  estimatedTimeMinutes: number;
  distance?: number;
  isSafe: boolean;
  status?: 'active' | 'blocked' | 'alternative';
  riskLevel?: RiskLevel;
  blockages: Coordinates[];
  roadCondition?: string;
}

export interface Shelter {
  id: string;
  name: string;
  district: District;
  coordinates: Coordinates;
  capacity: number;
  currentOccupancy: number;
  availableCapacity?: number;
  facilities: string[];
  medical?: boolean;
  food?: boolean;
  water?: boolean;
  power?: boolean;
  accessibility?: boolean;
  contactPerson: string;
  contactPhone: string;
  lastUpdated?: Date;
}

// ============================================================
// System Event Types
// ============================================================
export type EventType =
  | 'SENSOR_ANOMALY'
  | 'SENSOR_READING'
  | 'RISK_UPDATE'
  | 'RISK_THRESHOLD_CROSSED'
  | 'ALERT_CREATED'
  | 'ALERT_ACKNOWLEDGED'
  | 'FIELD_REPORT_CREATED'
  | 'FIELD_REPORT_VERIFIED'
  | 'INCIDENT_REPORTED'
  | 'INCIDENT_CREATED'
  | 'INCIDENT_STATUS_CHANGED'
  | 'RESOURCE_DISPATCHED'
  | 'EVACUATION_STARTED'
  | 'ROAD_STATUS_CHANGED'
  | 'SHELTER_UPDATED'
  | 'SIMULATION_STARTED'
  | 'SIMULATION_PHASE_CHANGED'
  | 'SIMULATION_COMPLETED';

export interface BaseSystemEvent {
  id: string;
  timestamp: Date;
  type: EventType;
  description?: string;
}

export interface SensorAnomalyEvent extends BaseSystemEvent {
  type: 'SENSOR_ANOMALY';
  sensorId: string;
  readingId: string;
}

export interface RiskUpdateEvent extends BaseSystemEvent {
  type: 'RISK_UPDATE';
  zoneId: string;
  previousLevel?: RiskLevel;
  newRiskLevel: RiskLevel;
  score?: number;
}

export interface AlertCreatedEvent extends BaseSystemEvent {
  type: 'ALERT_CREATED';
  alertId: string;
  severity?: AlertSeverity;
}

export interface IncidentReportedEvent extends BaseSystemEvent {
  type: 'INCIDENT_REPORTED' | 'INCIDENT_CREATED';
  incidentId: string;
}

export interface ResourceDispatchedEvent extends BaseSystemEvent {
  type: 'RESOURCE_DISPATCHED';
  resourceId: string;
  incidentId: string;
}

export interface SimulationPhaseEvent extends BaseSystemEvent {
  type: 'SIMULATION_PHASE_CHANGED';
  phase: SimulationPhase;
}

export type SystemEvent =
  | SensorAnomalyEvent
  | RiskUpdateEvent
  | AlertCreatedEvent
  | IncidentReportedEvent
  | ResourceDispatchedEvent
  | SimulationPhaseEvent
  | BaseSystemEvent;

// ============================================================
// Simulation Types
// ============================================================
export type SimulationPhase =
  | 'NORMAL'
  | 'HEAVY_RAIN'
  | 'EXTREME_RAIN'
  | 'SOIL_SATURATION'
  | 'SLOPE_MOVEMENT'
  | 'MULTI_SENSOR_ANOMALY'
  | 'IMMINENT_LANDSLIDE'
  | 'LANDSLIDE_OCCURRED'
  | 'ROAD_BLOCKAGE'
  | 'FLASH_FLOOD'
  | 'RECOVERY';

export type SimulationSpeed = 1 | 2 | 5 | 10 | 50;

export interface SimulationState {
  isActive: boolean;
  isPaused?: boolean;
  phase: SimulationPhase;
  elapsedSeconds: number;
  speed: SimulationSpeed;
  startedAt?: Date;
  events?: SystemEvent[];
  currentTime?: Date;
  progress?: number;
  metrics?: {
    alertsGenerated: number;
    incidentsCreated: number;
    resourcesDispatched: number;
    populationEvacuated: number;
  };
}

// ============================================================
// System Types
// ============================================================
export type ServiceName = 'API' | 'DATABASE' | 'WEATHER' | 'SENSORS' | 'GIS' | 'ML' | 'NOTIFICATIONS' | 'WEBSOCKET' | 'MODEL_ENGINE';

export type ServiceStatus = 'ONLINE' | 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'OFFLINE';

export interface ServiceHealth {
  name: ServiceName;
  status: ServiceStatus;
  latencyMs: number;
  lastChecked: Date;
  message?: string;
}

export type DataFreshness = 'LIVE' | 'RECENT' | 'STALE' | 'DEGRADED' | 'UNAVAILABLE' | 'SIMULATED';

// ============================================================
// Notification Types
// ============================================================
export type NotificationChannel = 'IN_APP' | 'SMS' | 'PUSH' | 'EMAIL' | 'WEBHOOK' | 'SIREN';
export type NotificationStatus = 'SENT' | 'PENDING' | 'FAILED' | 'NOT_CONFIGURED';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  createdAt: Date;
  channel?: NotificationChannel;
}

// ============================================================
// Dashboard KPI
// ============================================================
export interface DashboardKPI {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: string;
}
