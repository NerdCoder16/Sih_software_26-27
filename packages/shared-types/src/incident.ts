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
