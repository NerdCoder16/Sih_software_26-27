import React from 'react';
import { useRiskStore } from '@/stores/riskStore';
import { mockZones } from '@/services/mockData';
import { RiskScoreChart } from '@/components/charts/RiskScoreChart';
import { RainfallChart } from '@/components/charts/RainfallChart';
import { getRiskColor } from '@/utils/format';
import { ShieldAlert, TrendingUp, TrendingDown } from 'lucide-react';

export const RiskIntelligencePage = () => {
  const { selectedZoneId, selectZone } = useRiskStore();
  
  // Use mock data for immediate display
  const zones = mockZones;
  const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[0];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mockScores = [40, 42, 45, 55, 60, selectedZone.riskScore - 5, selectedZone.riskScore];
  const mockRainfall = [10, 20, 50, 120, 150, 80, 40];

  const riskChartData = mockScores.map((score, idx) => ({
    timestamp: new Date(Date.now() - (6 - idx) * 86400000).toISOString(),
    score
  }));

  const rainfallChartData = mockRainfall.map((val, idx) => ({
    timestamp: new Date(Date.now() - (6 - idx) * 86400000).toISOString(),
    value: val
  }));

  return (
    <div className="flex h-full w-full bg-slate-950 text-slate-200">
      {/* Left Panel */}
      <div className="w-80 border-r border-slate-800 bg-slate-900 overflow-y-auto shrink-0">
        <div className="p-4 border-b border-slate-800 font-bold text-lg sticky top-0 bg-slate-900 z-10">
          Risk Zones
        </div>
        <div className="flex flex-col">
          {zones.map(zone => (
            <div 
              key={zone.id} 
              onClick={() => selectZone(zone.id)}
              className={`p-4 border-b border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors ${selectedZoneId === zone.id ? 'bg-slate-800' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-slate-100">{zone.name}</h3>
                  <p className="text-xs text-slate-400">{zone.district}</p>
                </div>
                <div 
                  className="px-2 py-1 text-xs font-bold rounded"
                  style={{ backgroundColor: `${getRiskColor(zone.currentRiskLevel)}33`, color: getRiskColor(zone.currentRiskLevel) }}
                >
                  {zone.currentRiskLevel}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ width: `${zone.riskScore}%`, backgroundColor: getRiskColor(zone.currentRiskLevel) }}
                  />
                </div>
                <span className="text-xs font-mono">{zone.riskScore}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 overflow-y-auto bg-slate-950 p-6">
        {!selectedZone ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            <ShieldAlert size={48} className="mr-4 opacity-50" />
            <span className="text-xl">Select a risk zone to view intelligence</span>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-white">{selectedZone.name}</h1>
                <p className="text-slate-400">{selectedZone.district} District</p>
              </div>
              <div 
                className="px-4 py-2 font-bold rounded-lg text-lg border border-slate-700"
                style={{ color: getRiskColor(selectedZone.currentRiskLevel), backgroundColor: `${getRiskColor(selectedZone.currentRiskLevel)}11` }}
              >
                {selectedZone.currentRiskLevel} RISK
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Score Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center">
                <div className="text-slate-400 text-sm font-semibold mb-4 uppercase tracking-wider">Overall Risk Score</div>
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="8" fill="none" />
                    <circle 
                      cx="50" cy="50" r="40" 
                      stroke={getRiskColor(selectedZone.currentRiskLevel)} 
                      strokeWidth="8" fill="none" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={251.2 - (251.2 * selectedZone.riskScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-5xl font-bold text-white">{selectedZone.riskScore}</span>
                    <span className="text-xs text-slate-400 mt-1">/ 100</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  {selectedZone.riskScore > 50 ? <TrendingUp className="text-red-500" size={16} /> : <TrendingDown className="text-green-500" size={16} />}
                  <span className="text-sm font-medium">Confidence: 94%</span>
                </div>
              </div>

              {/* Factors */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:col-span-2">
                <h3 className="text-slate-300 font-semibold mb-4 border-b border-slate-800 pb-2">WHY DID RISK CHANGE?</h3>
                <div className="space-y-4">
                  {selectedZone.factors.map((factor, idx) => (
                    <div key={idx} className="bg-slate-800/50 p-3 rounded-lg flex items-center">
                      <div className="flex-1">
                        <div className="flex justify-between items-end mb-1">
                          <span className="font-medium text-slate-200 capitalize">{factor.type.replace('_', ' ')}</span>
                          <span className="text-xs text-slate-400">{factor.value} / {factor.threshold}</span>
                        </div>
                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${Math.min(100, (factor.value / factor.threshold) * 100)}%`,
                              backgroundColor: (factor.value / factor.threshold) > 0.8 ? '#ef4444' : '#3b82f6'
                            }}
                          />
                        </div>
                      </div>
                      <div className="ml-4 w-12 text-right font-bold text-slate-300">
                        {factor.contribution}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-80">
                <h3 className="text-slate-300 font-semibold mb-4">Risk Trend (Last 7 Days)</h3>
                <RiskScoreChart data={riskChartData} />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-80">
                <h3 className="text-slate-300 font-semibold mb-4">Rainfall Telemetry</h3>
                <RainfallChart data={rainfallChartData} />
              </div>
            </div>
            
            {/* Context Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-slate-300 font-semibold mb-4 border-b border-slate-800 pb-2">Population at Risk</h3>
                <div className="text-3xl font-bold text-white mb-2">{selectedZone.populationAtRisk.toLocaleString()}</div>
                <p className="text-slate-400 text-sm">Estimated individuals within the high-risk perimeter.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-slate-300 font-semibold mb-4 border-b border-slate-800 pb-2">Critical Infrastructure</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex justify-between"><span>Hospitals/Clinics:</span> <span>2</span></li>
                  <li className="flex justify-between"><span>Schools:</span> <span>4</span></li>
                  <li className="flex justify-between"><span>Major Roads:</span> <span>NH-29, State Hwy 12</span></li>
                </ul>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};
