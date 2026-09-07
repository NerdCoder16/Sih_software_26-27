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
