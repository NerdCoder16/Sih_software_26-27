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
