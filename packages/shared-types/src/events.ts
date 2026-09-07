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
