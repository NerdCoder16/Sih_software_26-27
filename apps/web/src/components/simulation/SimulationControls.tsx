import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, SkipForward } from 'lucide-react';
import { useSimulationStore } from '@/stores/simulationStore';
import { useAppStore } from '@/stores/appStore';
import { simulationEngine } from '@/services/simulationEngine';
import { createDataProvider } from '@/services/dataProviders';
import { SimulationPhase, SimulationSpeed } from '@/types';

const PHASES: SimulationPhase[] = [
  'NORMAL', 'HEAVY_RAIN', 'EXTREME_RAIN', 'SOIL_SATURATION', 
  'SLOPE_MOVEMENT', 'MULTI_SENSOR_ANOMALY', 'IMMINENT_LANDSLIDE', 
  'LANDSLIDE_OCCURRED', 'ROAD_BLOCKAGE', 'FLASH_FLOOD', 'RECOVERY'
];

export function SimulationControls() {
  const { state, start, pause, resume, reset, setSpeed, advancePhase, tick } = useSimulationStore();
  const { operatingMode } = useAppStore();

  useEffect(() => {
    let timer: number;
    if (state.isActive) {
      simulationEngine.start();
      timer = window.setInterval(() => {
        tick();
      }, 1000 / state.speed);
    } else {
      simulationEngine.stop();
    }
    return () => {
      clearInterval(timer);
    };
  }, [state.isActive, state.speed, tick]);

  const handleTogglePlay = async () => {
    const provider = createDataProvider(operatingMode);
    if (state.isActive) {
      pause();
      await provider.controlSimulation('pause');
    } else {
      if (state.elapsedSeconds === 0) {
        start();
        await provider.controlSimulation('start', state.speed);
      } else {
        resume();
        await provider.controlSimulation('start', state.speed);
      }
    }
  };

  const handleReset = async () => {
    simulationEngine.stop();
    simulationEngine.reset();
    reset();
    const provider = createDataProvider(operatingMode);
    await provider.controlSimulation('reset');
  };

  const currentIdx = PHASES.indexOf(state.phase);

  const handleNextPhase = async () => {
    const nextIdx = (currentIdx + 1) % PHASES.length;
    const nextPhase = PHASES[nextIdx];
    advancePhase(nextPhase);
    const provider = createDataProvider(operatingMode);
    await provider.controlSimulation('next');
  };

  const handleSpeedChange = async (newSpeed: SimulationSpeed) => {
    setSpeed(newSpeed);
    const provider = createDataProvider(operatingMode);
    await provider.controlSimulation('speed', newSpeed);
  };

  const formatSeconds = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `T+${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg w-full">
      <div className="flex items-center gap-2">
        <button 
          onClick={handleTogglePlay}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${
            state.isActive ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
          }`}
          title={state.isActive ? "Pause Simulation" : "Start Simulation"}
        >
          {state.isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>

        <button 
          onClick={handleReset}
          className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          title="Reset Simulation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button 
          onClick={handleNextPhase}
          className="w-9 h-9 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300 hover:bg-purple-800/50 transition-all"
          title="Skip to Next Phase"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 w-full max-w-xl px-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
          <span className="font-bold text-emerald-400">{formatSeconds(state.elapsedSeconds)}</span>
          <span className="text-purple-300 font-semibold uppercase">{state.phase.replace('_', ' ')}</span>
          <span>SPEED: {state.speed}x</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, ((currentIdx + 1) / PHASES.length) * 100)}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <FastForward className="w-4 h-4 text-slate-400" />
        <select 
          value={state.speed}
          onChange={(e) => handleSpeedChange(Number(e.target.value) as SimulationSpeed)}
          className="bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 rounded px-2 py-1 outline-none cursor-pointer"
        >
          <option value={1}>1x Speed</option>
          <option value={2}>2x Speed</option>
          <option value={5}>5x Speed</option>
          <option value={10}>10x Speed</option>
          <option value={50}>50x Speed</option>
        </select>
      </div>
    </div>
  );
}
