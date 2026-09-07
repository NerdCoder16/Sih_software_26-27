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
