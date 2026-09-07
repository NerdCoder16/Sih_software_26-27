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
