import React from 'react';
import { mockServiceHealth } from '@/services/mockData';
import { Activity, Server, Database, CloudRain, Cpu, Map, Bell, Globe } from 'lucide-react';

export const SystemPage = () => {
  const allHealthy = mockServiceHealth.every(s => s.status === 'ONLINE' || s.status === 'HEALTHY');

  const getIcon = (name: string) => {
    switch (name) {
      case 'API': case 'API Gateway': return <Server size={24} />;
      case 'DATABASE': case 'Database': return <Database size={24} />;
      case 'WEATHER': case 'Weather Integration': return <CloudRain size={24} />;
      case 'SENSORS': case 'Sensor Network': return <Cpu size={24} />;
      case 'GIS': case 'GIS Server': return <Map size={24} />;
      case 'ML': case 'MODEL_ENGINE': case 'ML Prediction Engine': return <Activity size={24} />;
      case 'NOTIFICATIONS': case 'Notification Service': return <Bell size={24} />;
      default: return <Globe size={24} />;
    }
  };

  return (
    <div className="h-full bg-slate-950 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Status Banner */}
        <div className={`rounded-xl p-6 flex items-center gap-4 ${allHealthy ? 'bg-green-900/20 border border-green-500/30' : 'bg-amber-900/20 border border-amber-500/30'}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${allHealthy ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {allHealthy ? 'All Core Services Operational' : 'Degraded System Performance'}
            </h1>
            <p className={`text-sm ${allHealthy ? 'text-green-200/70' : 'text-amber-200/70'}`}>
              Environment: DISASTER INTELLIGENCE PLATFORM. Last comprehensive check: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Grid of Services */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 border-b border-slate-800 pb-2">Core Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockServiceHealth.map(service => (
              <div key={service.name} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-slate-400 bg-slate-800 p-2 rounded-lg">
                    {getIcon(service.name)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      service.status === 'ONLINE' || service.status === 'HEALTHY' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' :
                      service.status === 'DEGRADED' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' :
                      'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                    }`}></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {service.status}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-white font-semibold mb-3">{service.name}</h3>
                
                <div className="space-y-2 text-xs text-slate-400">
                  <div className="flex justify-between items-center bg-slate-950/50 p-2 rounded">
                    <span>Latency</span>
                    <span className={`font-mono ${service.latencyMs > 500 ? 'text-amber-400' : 'text-slate-300'}`}>
                      {service.latencyMs}ms
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950/50 p-2 rounded">
                    <span>Last Checked</span>
                    <span className="font-mono text-slate-300">
                      {new Date(service.lastChecked).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
