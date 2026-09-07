import { create } from 'zustand';
import { SimulationState, SimulationPhase, SimulationSpeed } from '@/types';

interface SimulationStoreState {
  state: SimulationState;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  setSpeed: (speed: SimulationSpeed) => void;
  advancePhase: (phase: SimulationPhase) => void;
  tick: () => void;
}

const PHASES: SimulationPhase[] = [
  'NORMAL', 'HEAVY_RAIN', 'EXTREME_RAIN', 'SOIL_SATURATION', 
  'SLOPE_MOVEMENT', 'MULTI_SENSOR_ANOMALY', 'IMMINENT_LANDSLIDE', 
  'LANDSLIDE_OCCURRED', 'ROAD_BLOCKAGE', 'FLASH_FLOOD', 'RECOVERY'
];

export const useSimulationStore = create<SimulationStoreState>((set) => ({
  state: {
    isActive: false,
    phase: 'NORMAL',
    elapsedSeconds: 0,
    speed: 1
  },
  start: () => set((state) => ({ state: { ...state.state, isActive: true, elapsedSeconds: 0, phase: 'NORMAL' } })),
  pause: () => set((state) => ({ state: { ...state.state, isActive: false } })),
  resume: () => set((state) => ({ state: { ...state.state, isActive: true } })),
  reset: () => set((state) => ({ state: { ...state.state, isActive: false, elapsedSeconds: 0, phase: 'NORMAL' } })),
  setSpeed: (speed) => set((state) => ({ state: { ...state.state, speed } })),
  advancePhase: (phase) => set((state) => ({ state: { ...state.state, phase } })),
  tick: () => set((state) => {
    if (!state.state.isActive) return state;
    return { state: { ...state.state, elapsedSeconds: state.state.elapsedSeconds + state.state.speed } };
  })
}));
