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
