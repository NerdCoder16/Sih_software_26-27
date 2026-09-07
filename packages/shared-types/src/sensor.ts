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
  location: { lat: number; lng: number; altitude?: number };
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
