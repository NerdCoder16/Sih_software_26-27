export enum ResourceType {
  RESCUE_TEAM = 'RESCUE_TEAM',
  AMBULANCE = 'AMBULANCE',
  POLICE = 'POLICE',
  FIRE = 'FIRE',
  SDRF = 'SDRF',
  NDRF = 'NDRF',
  EXCAVATOR = 'EXCAVATOR',
  DRONE = 'DRONE',
  MEDICAL_TEAM = 'MEDICAL_TEAM'
}

export enum ResourceStatus {
  AVAILABLE = 'AVAILABLE',
  DISPATCHED = 'DISPATCHED',
  EN_ROUTE = 'EN_ROUTE',
  ON_SCENE = 'ON_SCENE',
  BUSY = 'BUSY',
  UNAVAILABLE = 'UNAVAILABLE'
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  status: ResourceStatus;
  location: { lat: number; lng: number };
  assignedIncidentId?: string;
  capacity: number;
  eta?: string;
  district: string;
  contactPhone: string;
}
