import React from 'react';
import { useSimulationStore } from '@/stores/simulationStore';
import { SimulationControls } from '@/components/simulation/SimulationControls';
import { SimulationEventLog } from '@/components/simulation/SimulationEventLog';
import { AlertTriangle, Users, Truck, Bell } from 'lucide-react';
import { SimulationPhase } from '@/types';

export const SimulationPage = () => {
  const { state } = useSimulationStore();
  const phases: SimulationPhase[] = ['NORMAL', 'HEAVY_RAIN', 'EXTREME_RAIN', 'SOIL_SATURATION', 'SLOPE_MOVEMENT', 'IMMINENT_LANDSLIDE', 'LANDSLIDE_OCCURRED', 'RECOVERY'];
  const currentPhaseIdx = phases.indexOf(state.phase);

  const metrics = state.metrics || {
    alertsGenerated: 4,
    incidentsCreated: 1,
    resourcesDispatched: 3,
    populationEvacuated: 1250,
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200">
      
      {/* Top Controls & Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">System Simulation</h1>
            <p className="text-sm text-slate-400">Run catastrophic event scenarios to test response protocols.</p>
          </div>
          <SimulationControls />
        </div>
      </div>

      {/* Phase Indicator */}
      <div className="bg-slate-950 p-6 pb-0 overflow-x-auto">
        <div className="max-w-7xl mx-auto relative min-w-[700px]">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-purple-600 z-0 transition-all duration-1000" 
            style={{ width: `${Math.max(0, currentPhaseIdx) * (100 / (phases.length - 1))}%` }}
          ></div>
          <div className="flex justify-between relative z-10">
            {phases.map((phase, idx) => (
              <div key={phase} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-4 border-slate-950 transition-colors duration-500 ${
                  idx < currentPhaseIdx ? 'bg-purple-600 text-white' :
                  idx === currentPhaseIdx ? 'bg-purple-500 text-white ring-4 ring-purple-500/30' :
                  'bg-slate-800 text-slate-500'
                }`}>
                  {idx + 1}
                </div>
                <span className={`mt-2 text-[10px] font-bold tracking-wider uppercase ${idx <= currentPhaseIdx ? 'text-white' : 'text-slate-600'}`}>
                  {phase.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex-1 p-6 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full overflow-hidden">
        
        {/* Left Col - Map/Viz Placeholder & Stats */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Active Phase Info */}
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-5">
            <h2 className="text-lg font-bold text-purple-300 mb-2">Phase: {state.phase}</h2>
            <p className="text-slate-300 text-sm">
              {state.phase === 'NORMAL' && 'System is monitoring environmental baselines. Weather patterns are stable.'}
              {state.phase === 'HEAVY_RAIN' && 'Heavy rainfall detected across Sohra & Mawsynram slopes. Sensor telemetry rising.'}
              {state.phase === 'EXTREME_RAIN' && 'Rainfall intensity exceeds 150mm/24h. Soil moisture reaching critical saturation levels.'}
              {state.phase === 'SOIL_SATURATION' && 'Soil saturation > 90%. Piezometers indicate dangerous pore water pressures.'}
              {state.phase === 'SLOPE_MOVEMENT' && 'Inclinometers detect 14mm displacement along NH-40 highway corridor slopes.'}
              {state.phase === 'IMMINENT_LANDSLIDE' && 'Landslide imminent! Automated sirens triggered, evac warnings dispatched.'}
              {state.phase === 'LANDSLIDE_OCCURRED' && 'Landslide occurred at NH-40 corridor. Emergency incident created.'}
              {state.phase === 'RECOVERY' && 'Threat level decreasing. Commencing damage assessment and stabilization protocols.'}
            </p>
          </div>

          {/* Viz Placeholder */}
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden flex flex-col items-center justify-center min-h-[250px]">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-slate-900 to-slate-950" style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)'}}></div>
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 rounded-full border-4 border-purple-500/50 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <AlertTriangle size={28} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Live Digital Twin Simulation</h3>
              <p className="text-slate-400 text-sm">Real-time spatial propagation and telemetry engine</p>
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <Bell size={20} className="text-yellow-500 mb-2" />
              <div className="text-2xl font-bold text-white">{metrics.alertsGenerated}</div>
              <div className="text-xs text-slate-500 uppercase mt-1">Alerts</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <AlertTriangle size={20} className="text-red-500 mb-2" />
              <div className="text-2xl font-bold text-white">{metrics.incidentsCreated}</div>
              <div className="text-xs text-slate-500 uppercase mt-1">Incidents</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <Truck size={20} className="text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-white">{metrics.resourcesDispatched}</div>
              <div className="text-xs text-slate-500 uppercase mt-1">Dispatched</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <Users size={20} className="text-green-500 mb-2" />
              <div className="text-2xl font-bold text-white">{metrics.populationEvacuated}</div>
              <div className="text-xs text-slate-500 uppercase mt-1">Evacuated</div>
            </div>
          </div>
        </div>

        {/* Right Col - Event Log */}
        <div className="w-full lg:w-96 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden h-[400px] lg:h-auto">
          <div className="p-4 border-b border-slate-800 font-bold text-white">
            Simulation Log
          </div>
          <div className="flex-1 overflow-y-auto">
            <SimulationEventLog />
          </div>
        </div>

      </div>
    </div>
  );
};
