import { useEffect } from 'react';
import { useSimulationStore } from '@/stores/simulationStore';
import { SimulationPhase } from '@/types';

const PHASE_DURATIONS: Record<SimulationPhase, number> = {
  NORMAL: 60,
  HEAVY_RAIN: 120, // Ends at 120 (so 60s duration)
  EXTREME_RAIN: 180,
  SOIL_SATURATION: 220,
  SLOPE_MOVEMENT: 260,
  MULTI_SENSOR_ANOMALY: 290,
  IMMINENT_LANDSLIDE: 320,
  LANDSLIDE_OCCURRED: 350,
  ROAD_BLOCKAGE: 380,
  FLASH_FLOOD: 410,
  RECOVERY: 480
};

export function useSimulation() {
  const { state, tick, advancePhase } = useSimulationStore();

  useEffect(() => {
    if (!state.isActive) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isActive, tick]);

  useEffect(() => {
    if (!state.isActive) return;
    
    // Determine current phase based on elapsed time
    let newPhase: SimulationPhase = 'NORMAL';
    if (state.elapsedSeconds >= PHASE_DURATIONS.RECOVERY) {
      newPhase = 'RECOVERY';
    } else if (state.elapsedSeconds >= PHASE_DURATIONS.FLASH_FLOOD) {
      newPhase = 'FLASH_FLOOD';
    } else if (state.elapsedSeconds >= PHASE_DURATIONS.ROAD_BLOCKAGE) {
      newPhase = 'ROAD_BLOCKAGE';
    } else if (state.elapsedSeconds >= PHASE_DURATIONS.LANDSLIDE_OCCURRED) {
      newPhase = 'LANDSLIDE_OCCURRED';
    } else if (state.elapsedSeconds >= PHASE_DURATIONS.IMMINENT_LANDSLIDE) {
      newPhase = 'IMMINENT_LANDSLIDE';
    } else if (state.elapsedSeconds >= PHASE_DURATIONS.MULTI_SENSOR_ANOMALY) {
      newPhase = 'MULTI_SENSOR_ANOMALY';
    } else if (state.elapsedSeconds >= PHASE_DURATIONS.SLOPE_MOVEMENT) {
      newPhase = 'SLOPE_MOVEMENT';
    } else if (state.elapsedSeconds >= PHASE_DURATIONS.SOIL_SATURATION) {
      newPhase = 'SOIL_SATURATION';
    } else if (state.elapsedSeconds >= PHASE_DURATIONS.EXTREME_RAIN) {
      newPhase = 'EXTREME_RAIN';
    } else if (state.elapsedSeconds >= PHASE_DURATIONS.HEAVY_RAIN) {
      newPhase = 'HEAVY_RAIN';
    }

    if (newPhase !== state.phase) {
      advancePhase(newPhase);
    }
  }, [state.elapsedSeconds, state.phase, state.isActive, advancePhase]);

  return state;
}
