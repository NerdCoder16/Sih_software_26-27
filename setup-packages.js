const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const packagesDir = path.join(rootDir, 'packages');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 1. shared-types
const sharedTypesDir = path.join(packagesDir, 'shared-types');
ensureDir(path.join(sharedTypesDir, 'src'));
fs.writeFileSync(path.join(sharedTypesDir, 'package.json'), JSON.stringify({
  name: "@ner-ewrs/shared-types",
  version: "1.0.0",
  main: "dist/index.js",
  types: "dist/index.d.ts",
  scripts: { "build": "tsc" },
  devDependencies: { "typescript": "^5.0.0" }
}, null, 2));
fs.writeFileSync(path.join(sharedTypesDir, 'tsconfig.json'), JSON.stringify({
  compilerOptions: {
    target: "es2022",
    module: "commonjs",
    declaration: true,
    outDir: "./dist",
    strict: true
  },
  include: ["src"]
}, null, 2));

const sharedTypesFiles = {
  'risk.ts': `
export enum RiskLevel {
  SAFE = 'SAFE',
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface RiskFactor {
  name: string;
  value: number;
  weight: number;
  trend: 'rising' | 'falling' | 'stable';
  description: string;
}

export interface RiskZone {
  id: string;
  name: string;
  district: string;
  state: string;
  coordinates: { lat: number; lng: number };
  polygon: any;
  riskLevel: RiskLevel;
  riskScore: number;
  confidence: number;
  trend: 'rising' | 'falling' | 'stable';
  factors: RiskFactor[];
  population: number;
  infrastructure: string[];
  lastUpdated: string;
  source: string;
}

export interface RiskHistory {
  zoneId: string;
  timestamp: string;
  riskScore: number;
  riskLevel: RiskLevel;
  factors: RiskFactor[];
}
`,
  'sensor.ts': `
export enum SensorType {
  RAIN_GAUGE = 'RAIN_GAUGE',
  SOIL_MOISTURE = 'SOIL_MOISTURE',
  INCLINOMETER = 'INCLINOMETER',
  PIEZOMETER = 'PIEZOMETER',
  GPS_STATION = 'GPS_STATION',
  ACCELEROMETER = 'ACCELEROMETER',
  CRACK_METER = 'CRACK_METER',
  WEATHER_STATION = 'WEATHER_STATION'
}

export enum SensorStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  DEGRADED = 'DEGRADED',
  MAINTENANCE = 'MAINTENANCE',
  UNKNOWN = 'UNKNOWN'
}

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  location: { lat: number; lng: number; altitude: number };
  status: SensorStatus;
  lastReading: number;
  lastUpdated: string;
  batteryLevel: number;
  zoneId: string;
  district: string;
}

export interface SensorReading {
  sensorId: string;
  timestamp: string;
  value: number;
  unit: string;
  quality: number;
  anomaly: boolean;
}
`,
  'weather.ts': `
export interface RainfallData {
  stationId: string;
  timestamp: string;
  hourly: number;
  daily: number;
  cumulative: number;
  intensity: 'light' | 'moderate' | 'heavy' | 'extreme';
  forecast: number;
}

export interface WeatherStation {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  district: string;
  status: string;
}
`,
  'alert.ts': `
export enum AlertSeverity {
  INFORMATION = 'INFORMATION',
  WATCH = 'WATCH',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
  SYSTEM = 'SYSTEM'
}

export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
  EXPIRED = 'EXPIRED'
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  message: string;
  location: { lat: number; lng: number };
  zoneId: string;
  timestamp: string;
  expiresAt: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  actions: string[];
  source: string;
}
`,
  'incident.ts': `
export enum IncidentStatus {
  DETECTED = 'DETECTED',
  ASSESSING = 'ASSESSING',
  VERIFIED = 'VERIFIED',
  DECLARED = 'DECLARED',
  RESPONDING = 'RESPONDING',
  EVACUATING = 'EVACUATING',
  RESCUE = 'RESCUE',
  CONTAINED = 'CONTAINED',
  RECOVERY = 'RECOVERY',
  CLOSED = 'CLOSED'
}

export enum IncidentSeverity {
  MINOR = 'MINOR',
  MODERATE = 'MODERATE',
  MAJOR = 'MAJOR',
  SEVERE = 'SEVERE',
  CATASTROPHIC = 'CATASTROPHIC'
}

export interface IncidentEvent {
  timestamp: string;
  type: string;
  description: string;
  actor: string;
  data: any;
}

export interface ResourceAssignment {
  resourceId: string;
  assignedAt: string;
  status: string;
}

export interface Incident {
  id: string;
  title: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  location: { lat: number; lng: number };
  district: string;
  description: string;
  detectedAt: string;
  declaredAt?: string;
  closedAt?: string;
  population: number;
  roadsAffected: string[];
  timeline: IncidentEvent[];
  resources: ResourceAssignment[];
  fieldReports: string[];
  priorityScore: number;
  priorityFactors: string[];
}
`,
  'field.ts': `
export enum FieldReportType {
  CRACK = 'CRACK',
  GROUND_MOVEMENT = 'GROUND_MOVEMENT',
  LANDSLIDE = 'LANDSLIDE',
  ROAD_BLOCKAGE = 'ROAD_BLOCKAGE',
  FLOOD = 'FLOOD',
  DRAINAGE_FAILURE = 'DRAINAGE_FAILURE',
  OTHER = 'OTHER'
}

export enum SyncStatus {
  SYNCED = 'SYNCED',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  OFFLINE = 'OFFLINE'
}

export interface MediaAttachment {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnailUrl: string;
  capturedAt: string;
}

export interface FieldReport {
  id: string;
  type: FieldReportType;
  location: { lat: number; lng: number };
  timestamp: string;
  reporterId: string;
  reporterName: string;
  description: string;
  severity: 1 | 2 | 3 | 4 | 5;
  media: MediaAttachment[];
  syncStatus: SyncStatus;
  incidentId?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}
`,
  'resource.ts': `
export enum ResourceType {
  RESCUE_TEAM = 'RESCUE_TEAM',
  AMBULANCE = 'AMBULANCE',
  POLICE = 'POLICE',
  FIRE = 'FIRE',
  SDRF = 'SDRF',
  NDRF = 'NDRF',
  EXCAVATOR = 'EXCAVATOR',
  DRONE = 'DRONE',
  MEDICAL_TEAM = 'MEDICAL_TEAM'
}

export enum ResourceStatus {
  AVAILABLE = 'AVAILABLE',
  DISPATCHED = 'DISPATCHED',
  EN_ROUTE = 'EN_ROUTE',
  ON_SCENE = 'ON_SCENE',
  BUSY = 'BUSY',
  UNAVAILABLE = 'UNAVAILABLE'
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  status: ResourceStatus;
  location: { lat: number; lng: number };
  assignedIncidentId?: string;
  capacity: number;
  eta?: string;
  district: string;
  contactPhone: string;
}
`,
  'evacuation.ts': `
export interface EvacuationRoute {
  id: string;
  name: string;
  fromZoneId: string;
  toShelterId: string;
  path: { lat: number; lng: number }[];
  distance: number;
  eta: string;
  riskLevel: string;
  status: 'active' | 'blocked' | 'alternative';
  roadCondition: string;
}

export interface Shelter {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  district: string;
  capacity: number;
  occupancy: number;
  availableCapacity: number;
  medical: boolean;
  food: boolean;
  water: boolean;
  power: boolean;
  accessibility: boolean;
  contactPhone: string;
  lastUpdated: string;
}
`,
  'events.ts': `
export interface SensorReadingReceived { type: 'SensorReadingReceived'; sensorId: string; reading: any; }
export interface RiskUpdated { type: 'RiskUpdated'; zoneId: string; previousLevel: string; newLevel: string; score: number; factors: any[]; }
export interface RiskThresholdCrossed { type: 'RiskThresholdCrossed'; zoneId: string; threshold: number; direction: 'up' | 'down'; }
export interface AlertCreated { type: 'AlertCreated'; alert: any; }
export interface AlertAcknowledged { type: 'AlertAcknowledged'; alertId: string; acknowledgedBy: string; timestamp: string; }
export interface FieldReportCreated { type: 'FieldReportCreated'; report: any; }
export interface FieldReportVerified { type: 'FieldReportVerified'; reportId: string; verifiedBy: string; }
export interface IncidentCreated { type: 'IncidentCreated'; incident: any; }
export interface IncidentStatusChanged { type: 'IncidentStatusChanged'; incidentId: string; previousStatus: string; newStatus: string; actor: string; }
export interface ResourceDispatched { type: 'ResourceDispatched'; resourceId: string; incidentId: string; eta: string; }
export interface EvacuationStarted { type: 'EvacuationStarted'; zoneId: string; routeId: string; population: number; }
export interface RoadStatusChanged { type: 'RoadStatusChanged'; roadId: string; previousStatus: string; newStatus: string; }
export interface ShelterUpdated { type: 'ShelterUpdated'; shelterId: string; occupancy: number; capacity: number; }
export interface SimulationStarted { type: 'SimulationStarted'; scenarioId: string; speed: number; }
export interface SimulationPhaseChanged { type: 'SimulationPhaseChanged'; phase: string; timestamp: string; }
export interface SimulationCompleted { type: 'SimulationCompleted'; summary: any; }

export type SystemEvent =
  | SensorReadingReceived
  | RiskUpdated
  | RiskThresholdCrossed
  | AlertCreated
  | AlertAcknowledged
  | FieldReportCreated
  | FieldReportVerified
  | IncidentCreated
  | IncidentStatusChanged
  | ResourceDispatched
  | EvacuationStarted
  | RoadStatusChanged
  | ShelterUpdated
  | SimulationStarted
  | SimulationPhaseChanged
  | SimulationCompleted;
`,
  'simulation.ts': `
export enum SimulationPhase {
  NORMAL = 'NORMAL',
  HEAVY_RAIN = 'HEAVY_RAIN',
  EXTREME_RAIN = 'EXTREME_RAIN',
  SOIL_SATURATION = 'SOIL_SATURATION',
  SLOPE_MOVEMENT = 'SLOPE_MOVEMENT',
  MULTI_SENSOR_ANOMALY = 'MULTI_SENSOR_ANOMALY',
  IMMINENT_LANDSLIDE = 'IMMINENT_LANDSLIDE',
  LANDSLIDE_OCCURRED = 'LANDSLIDE_OCCURRED',
  ROAD_BLOCKAGE = 'ROAD_BLOCKAGE',
  FLASH_FLOOD = 'FLASH_FLOOD',
  RECOVERY = 'RECOVERY'
}

export type SimulationSpeed = 1 | 5 | 10 | 50;

export interface SimulationState {
  phase: SimulationPhase;
  speed: SimulationSpeed;
  progress: number;
  isRunning: boolean;
  isPaused: boolean;
  startedAt: string;
  events: any[];
  currentTime: string;
}
`,
  'system.ts': `
export enum ServiceName {
  API = 'API',
  DATABASE = 'DATABASE',
  WEATHER = 'WEATHER',
  SENSORS = 'SENSORS',
  GIS = 'GIS',
  ML = 'ML',
  NOTIFICATIONS = 'NOTIFICATIONS',
  WEBSOCKET = 'WEBSOCKET'
}

export enum ServiceStatus {
  HEALTHY = 'HEALTHY',
  DEGRADED = 'DEGRADED',
  DOWN = 'DOWN'
}

export interface ServiceHealth {
  name: ServiceName;
  status: ServiceStatus;
  latency: number;
  lastChecked: string;
  message?: string;
}

export interface DataFreshness {
  value: any;
  source: string;
  timestamp: string;
  age: number;
  status: 'LIVE' | 'RECENT' | 'STALE' | 'DEGRADED' | 'UNAVAILABLE' | 'SIMULATED';
}
`,
  'notification.ts': `
export enum NotificationChannel {
  IN_APP = 'IN_APP',
  SMS = 'SMS',
  PUSH = 'PUSH',
  EMAIL = 'EMAIL',
  WEBHOOK = 'WEBHOOK',
  SIREN = 'SIREN'
}

export enum NotificationStatus {
  SENT = 'SENT',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  NOT_CONFIGURED = 'NOT_CONFIGURED'
}

export interface Notification {
  id: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  recipient: string;
  message: string;
  timestamp: string;
}
`,
  'common.ts': `
export interface Coordinates {
  lat: number;
  lng: number;
  altitude?: number;
}

export interface GeoJSONPolygon {
  type: string;
  coordinates: number[][][];
}

export interface District {
  id: string;
  name: string;
  state: string;
  center: Coordinates;
}

export type OperatingMode = 'LIVE' | 'DEMO';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
`,
  'index.ts': `
export * from './risk';
export * from './sensor';
export * from './weather';
export * from './alert';
export * from './incident';
export * from './field';
export * from './resource';
export * from './evacuation';
export * from './events';
export * from './simulation';
export * from './system';
export * from './notification';
export * from './common';
`
};

for (const [name, content] of Object.entries(sharedTypesFiles)) {
  fs.writeFileSync(path.join(sharedTypesDir, 'src', name), content.trim() + '\\n');
}

// 2. api-contracts
const apiContractsDir = path.join(packagesDir, 'api-contracts');
ensureDir(path.join(apiContractsDir, 'src'));
fs.writeFileSync(path.join(apiContractsDir, 'package.json'), JSON.stringify({
  name: "@ner-ewrs/api-contracts",
  version: "1.0.0",
  main: "dist/index.js",
  types: "dist/index.d.ts",
  scripts: { "build": "tsc" },
  dependencies: { "@ner-ewrs/shared-types": "*" },
  devDependencies: { "typescript": "^5.0.0" }
}, null, 2));
fs.writeFileSync(path.join(apiContractsDir, 'tsconfig.json'), JSON.stringify({
  compilerOptions: {
    target: "es2022",
    module: "commonjs",
    declaration: true,
    outDir: "./dist",
    strict: true
  },
  include: ["src"]
}, null, 2));

fs.writeFileSync(path.join(apiContractsDir, 'src', 'index.ts'), `
import { 
  RiskZone, Sensor, SensorReading, RainfallData, Incident, Alert, 
  FieldReport, Resource, Shelter, EvacuationRoute, ServiceHealth 
} from '@ner-ewrs/shared-types';

export interface DashboardResponse {
  kpis: any;
  alerts: Alert[];
  recentIncidents: Incident[];
}

export interface CreateIncidentRequest {
  title: string;
  location: { lat: number; lng: number };
  description: string;
  severity: string;
}

export interface UpdateIncidentStatusRequest {
  status: string;
}

export interface AcknowledgeAlertRequest {
  acknowledgedBy: string;
}

export interface CreateFieldReportRequest {
  type: string;
  location: { lat: number; lng: number };
  description: string;
  severity: number;
}

export interface DispatchResourceRequest {
  incidentId: string;
}

export interface StartSimulationRequest {
  scenarioId: string;
  speed: number;
}
`.trim() + '\\n');

// 3. design-tokens
const designTokensDir = path.join(packagesDir, 'design-tokens');
ensureDir(path.join(designTokensDir, 'src'));
fs.writeFileSync(path.join(designTokensDir, 'package.json'), JSON.stringify({
  name: "@ner-ewrs/design-tokens",
  version: "1.0.0",
  main: "dist/index.js",
  types: "dist/index.d.ts",
  scripts: { "build": "tsc" },
  devDependencies: { "typescript": "^5.0.0" }
}, null, 2));
fs.writeFileSync(path.join(designTokensDir, 'tsconfig.json'), JSON.stringify({
  compilerOptions: {
    target: "es2022",
    module: "commonjs",
    declaration: true,
    outDir: "./dist",
    strict: true
  },
  include: ["src"]
}, null, 2));

fs.writeFileSync(path.join(designTokensDir, 'src', 'tokens.ts'), `
export const colors = {
  risk: {
    safe: 'green',
    low: 'teal',
    moderate: 'amber',
    high: 'orange',
    critical: 'red'
  },
  status: {
    active: 'blue',
    inactive: 'gray'
  }
};
export const spacing = {
  sm: '8px',
  md: '16px',
  lg: '24px'
};
`.trim() + '\\n');
fs.writeFileSync(path.join(designTokensDir, 'src', 'index.ts'), `export * from './tokens';\n`);

// 4. config
const configDir = path.join(packagesDir, 'config');
ensureDir(path.join(configDir, 'src'));
fs.writeFileSync(path.join(configDir, 'package.json'), JSON.stringify({
  name: "@ner-ewrs/config",
  version: "1.0.0",
  main: "dist/index.js",
  types: "dist/index.d.ts",
  scripts: { "build": "tsc" },
  devDependencies: { "typescript": "^5.0.0" }
}, null, 2));
fs.writeFileSync(path.join(configDir, 'tsconfig.json'), JSON.stringify({
  compilerOptions: {
    target: "es2022",
    module: "commonjs",
    declaration: true,
    outDir: "./dist",
    strict: true
  },
  include: ["src"]
}, null, 2));

fs.writeFileSync(path.join(configDir, 'src', 'index.ts'), `
export interface AppConfig {
  map: { center: { lat: number; lng: number }; zoom: number };
  apiBaseUrl: string;
  wsUrl: string;
  features: { [key: string]: boolean };
}

export const defaultConfig: AppConfig = {
  map: {
    center: { lat: 25.5, lng: 93.0 },
    zoom: 7
  },
  apiBaseUrl: 'http://localhost:3000/api',
  wsUrl: 'ws://localhost:3000',
  features: {
    simulation: true,
    realTimeSensors: true
  }
};
`.trim() + '\\n');

console.log("All packages created successfully.");
