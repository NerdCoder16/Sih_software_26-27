export enum FieldReportType {
  CRACK = 'CRACK',
  GROUND_MOVEMENT = 'GROUND_MOVEMENT',
  LANDSLIDE = 'LANDSLIDE',
  ROAD_BLOCKAGE = 'ROAD_BLOCKAGE',
  FLOOD = 'FLOOD',
  DRAINAGE_FAILURE = 'DRAINAGE_FAILURE',
  OTHER = 'OTHER'
}

export enum SyncStatus {
  SYNCED = 'SYNCED',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  OFFLINE = 'OFFLINE'
}

export interface MediaAttachment {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnailUrl: string;
  capturedAt: string;
}

export interface FieldReport {
  id: string;
  type: FieldReportType;
  location: { lat: number; lng: number };
  timestamp: string;
  reporterId: string;
  reporterName: string;
  description: string;
  severity: 1 | 2 | 3 | 4 | 5;
  media: MediaAttachment[];
  syncStatus: SyncStatus;
  incidentId?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}
