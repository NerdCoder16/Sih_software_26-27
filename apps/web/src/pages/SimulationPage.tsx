import React, { useState } from 'react';
import { useSimulationStore } from '@/stores/simulationStore';
import { SimulationControls } from '@/components/simulation/SimulationControls';
import { SimulationEventLog } from '@/components/simulation/SimulationEventLog';
import { RiskMap } from '@/components/map/RiskMap';
import { AlertTriangle, Users, Truck, Bell, Layers, Activity, CloudRain, Droplets, Mountain } from 'lucide-react';
import { SimulationPhase } from '@/types';

export const SimulationPage = () => {
  const { state } = useSimulationStore();
  const phases: SimulationPhase[] = ['NORMAL', 'HEAVY_RAIN', 'EXTREME_RAIN', 'SOIL_SATURATION', 'SLOPE_MOVEMENT', 'IMMINENT_LANDSLIDE', 'LANDSLIDE_OCCURRED', 'RECOVERY'];
  const currentPhaseIdx = phases.indexOf(state.phase);

  const [layerVisibility, setLayerVisibility] = useState<Record<string, boolean>>({
    'risk-zones': true,
    'sensors': true,
    'incidents': true,
    'evacuation-routes': true,
    'shelters': true,
  });

  const toggleLayer = (layerId: string) => {
    setLayerVisibility((prev) => ({ ...prev, [layerId]: !prev[layerId] }));
  };

  const metrics = state.metrics || {
    alertsGenerated: 4,
    incidentsCreated: 1,
    resourcesDispatched: 3,
    populationEvacuated: 1250,
  };

  // Dynamic telemetry based on current simulation phase
  const getTelemetryData = (phase: SimulationPhase) => {
    switch (phase) {
      case 'NORMAL':
        return { rainfall: 5, saturation: 35, displacement: 0.2, riskScore: 12, status: 'NORMAL' };
      case 'HEAVY_RAIN':
        return { rainfall: 65, saturation: 62, displacement: 1.5, riskScore: 45, status: 'ELEVATED' };
      case 'EXTREME_RAIN':
        return { rainfall: 160, saturation: 84, displacement: 4.1, riskScore: 72, status: 'HIGH RISK' };
      case 'SOIL_SATURATION':
        return { rainfall: 195, saturation: 94, displacement: 8.3, riskScore: 85, status: 'CRITICAL' };
      case 'SLOPE_MOVEMENT':
        return { rainfall: 210, saturation: 98, displacement: 14.7, riskScore: 94, status: 'SEVERE DISPLACEMENT' };
      case 'IMMINENT_LANDSLIDE':
        return { rainfall: 240, saturation: 100, displacement: 28.5, riskScore: 99, status: 'IMMINENT FAILURE' };
      case 'LANDSLIDE_OCCURRED':
        return { rainfall: 180, saturation: 100, displacement: 45.0, riskScore: 100, status: 'LANDSLIDE ACTIVE' };
      case 'RECOVERY':
        return { rainfall: 20, saturation: 75, displacement: 45.2, riskScore: 35, status: 'RECOVERY / STABILIZING' };
      default:
        return { rainfall: 10, saturation: 40, displacement: 0.5, riskScore: 15, status: 'NORMAL' };
    }
  };

  const telemetry = getTelemetryData(state.phase);

  return (
    <div className="flex flex-col min-h-full overflow-y-auto bg-slate-950 text-slate-200">
      
      {/* Top Controls & Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="text-purple-400 animate-pulse" size={24} /> System Digital Twin Simulation
            </h1>
            <p className="text-sm text-slate-400">Run catastrophic event scenarios & simulate real-time GIS spatial propagation.</p>
          </div>
          <SimulationControls />
        </div>
      </div>

      {/* Phase Indicator Progress Bar */}
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
      <div className="flex-1 p-6 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full">
        
        {/* Left Col - Digital Twin GIS Map & Live Telemetry Gauges */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Active Phase Banner */}
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping"></span>
                <h2 className="text-lg font-bold text-purple-300">Phase: {state.phase.replace('_', ' ')}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-semibold border border-purple-800">
                  {telemetry.status}
                </span>
              </div>
              <p className="text-slate-300 text-sm mt-1">
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
          </div>

          {/* Telemetry Gauge Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                <CloudRain size={20} />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Rainfall Intensity</div>
                <div className="text-lg font-bold text-white">{telemetry.rainfall} <span className="text-xs text-slate-400 font-normal">mm/h</span></div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Droplets size={20} />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Soil Moisture Saturation</div>
                <div className="text-lg font-bold text-white">{telemetry.saturation}%</div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-400">
                <Mountain size={20} />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Inclinometer Shift</div>
                <div className="text-lg font-bold text-white">{telemetry.displacement} <span className="text-xs text-slate-400 font-normal">mm</span></div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${telemetry.riskScore > 75 ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                <Activity size={20} />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Composite Risk Index</div>
                <div className={`text-lg font-bold ${telemetry.riskScore > 75 ? 'text-red-400' : telemetry.riskScore > 40 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {telemetry.riskScore}%
                </div>
              </div>
            </div>
          </div>

          {/* Digital Twin GIS Interactive Map Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden flex flex-col h-[480px] sm:h-[520px]">
            {/* GIS Layer Control Header */}
            <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Layers size={14} className="text-purple-400" />
                Digital Twin Map Overlays
              </div>
              <div className="flex items-center gap-2 overflow-x-auto">
                {[
                  { id: 'risk-zones', label: 'Risk Zones' },
                  { id: 'sensors', label: 'Sensors' },
                  { id: 'incidents', label: 'Incidents' },
                  { id: 'evacuation-routes', label: 'Evac Routes' },
                  { id: 'shelters', label: 'Shelters' },
                ].map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => toggleLayer(layer.id)}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors border ${
                      layerVisibility[layer.id]
                        ? 'bg-purple-950 text-purple-300 border-purple-600/50'
                        : 'bg-slate-800/60 text-slate-500 border-slate-700/50 hover:text-slate-300'
                    }`}
                  >
                    {layer.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Map Canvas */}
            <div className="relative flex-1 w-full h-full min-h-[350px]">
              <RiskMap layerVisibility={layerVisibility} />
            </div>
          </div>

          {/* System Response Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <Bell size={20} className="text-yellow-500 mb-2" />
              <div className="text-2xl font-bold text-white">{metrics.alertsGenerated}</div>
              <div className="text-xs text-slate-500 uppercase mt-1">Alerts Dispatched</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <AlertTriangle size={20} className="text-red-500 mb-2" />
              <div className="text-2xl font-bold text-white">{metrics.incidentsCreated}</div>
              <div className="text-xs text-slate-500 uppercase mt-1">Active Incidents</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <Truck size={20} className="text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-white">{metrics.resourcesDispatched}</div>
              <div className="text-xs text-slate-500 uppercase mt-1">Units Dispatched</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <Users size={20} className="text-green-500 mb-2" />
              <div className="text-2xl font-bold text-white">{metrics.populationEvacuated}</div>
              <div className="text-xs text-slate-500 uppercase mt-1">Evacuated Citizens</div>
            </div>
          </div>
        </div>

        {/* Right Col - Event Stream & Logs */}
        <div className="w-full lg:w-96 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden h-[480px] sm:h-[680px]">
          <div className="p-4 border-b border-slate-800 font-bold text-white flex items-center justify-between">
            <span>Simulation Event Stream</span>
            <span className="flex items-center gap-1.5 text-xs text-green-400 font-normal">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Live Feed
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <SimulationEventLog />
          </div>
        </div>

      </div>
    </div>
  );
};

