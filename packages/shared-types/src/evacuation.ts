export interface EvacuationRoute {
  id: string;
  name: string;
  fromZoneId: string;
  toShelterId: string;
  path: { lat: number; lng: number }[];
  distance: number;
  eta: string;
  riskLevel: string;
  status: 'active' | 'blocked' | 'alternative';
  roadCondition: string;
}

export interface Shelter {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  district: string;
  capacity: number;
  occupancy: number;
  availableCapacity: number;
  medical: boolean;
  food: boolean;
  water: boolean;
  power: boolean;
  accessibility: boolean;
  contactPhone: string;
  lastUpdated: string;
}
