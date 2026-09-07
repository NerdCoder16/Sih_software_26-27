export enum SimulationPhase {
  NORMAL = 'NORMAL',
  HEAVY_RAIN = 'HEAVY_RAIN',
  EXTREME_RAIN = 'EXTREME_RAIN',
  SOIL_SATURATION = 'SOIL_SATURATION',
  SLOPE_MOVEMENT = 'SLOPE_MOVEMENT',
  MULTI_SENSOR_ANOMALY = 'MULTI_SENSOR_ANOMALY',
  IMMINENT_LANDSLIDE = 'IMMINENT_LANDSLIDE',
  LANDSLIDE_OCCURRED = 'LANDSLIDE_OCCURRED',
  ROAD_BLOCKAGE = 'ROAD_BLOCKAGE',
  FLASH_FLOOD = 'FLASH_FLOOD',
  RECOVERY = 'RECOVERY'
}

export type SimulationSpeed = 1 | 5 | 10 | 50;

export interface SimulationState {
  phase: SimulationPhase;
  speed: SimulationSpeed;
  progress: number;
  isRunning: boolean;
  isPaused: boolean;
  startedAt: string;
  events: any[];
  currentTime: string;
}
