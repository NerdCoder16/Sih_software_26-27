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
