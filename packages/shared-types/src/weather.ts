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
