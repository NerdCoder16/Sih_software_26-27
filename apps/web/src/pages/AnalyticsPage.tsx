import React from 'react';
import { IncidentTimelineChart } from '@/components/charts/IncidentTimelineChart';
import { RainfallChart } from '@/components/charts/RainfallChart';
import { BarChart3, PieChart, Activity, Droplets } from 'lucide-react';
import { mockMonthlyIncidents } from '@/services/mockData';

export const AnalyticsPage = () => {
  const timelineData = mockMonthlyIncidents.map(m => ({
    month: m.month,
    minor: Math.floor(m.count * 0.5),
    major: Math.floor(m.count * 0.35),
    critical: Math.floor(m.count * 0.15)
  }));

  const rainfallData = [
    { timestamp: new Date(Date.now() - 6*86400000).toISOString(), value: 10 },
    { timestamp: new Date(Date.now() - 5*86400000).toISOString(), value: 20 },
    { timestamp: new Date(Date.now() - 4*86400000).toISOString(), value: 15 },
    { timestamp: new Date(Date.now() - 3*86400000).toISOString(), value: 30 },
    { timestamp: new Date(Date.now() - 2*86400000).toISOString(), value: 60 },
    { timestamp: new Date(Date.now() - 1*86400000).toISOString(), value: 80 },
    { timestamp: new Date().toISOString(), value: 40 },
  ];

  return (
    <div className="h-full bg-slate-950 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">System Analytics</h1>
            <p className="text-slate-400">Comprehensive overview of historical data and system performance.</p>
          </div>
          <select className="bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 outline-none focus:border-blue-500">
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Year to Date</option>
            <option>All Time</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Panel 1: Monthly Incidents */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4 text-white font-semibold">
              <Activity size={18} className="text-blue-500" /> Incident Frequency
            </div>
            <div className="h-72">
              <IncidentTimelineChart data={timelineData} />
            </div>
          </div>

          {/* Panel 2: Risk Distribution */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-white font-semibold">
              <PieChart size={18} className="text-amber-500" /> Risk Distribution
            </div>
            <div className="flex-1 flex items-center justify-center relative">
              <div className="w-48 h-48 rounded-full border-[16px] border-slate-800 relative flex items-center justify-center"
                   style={{
                     background: 'conic-gradient(#ef4444 0% 15%, #f97316 15% 35%, #eab308 35% 65%, #22c55e 65% 100%)'
                   }}>
                <div className="absolute inset-0 bg-slate-900 m-[-16px] rounded-full border-[16px] border-transparent" style={{clipPath: 'circle(70% at 50% 50%)'}}></div>
                <div className="absolute w-32 h-32 bg-slate-900 rounded-full z-10 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">12</span>
                  <span className="text-xs text-slate-400">Total Zones</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-medium text-slate-400">
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Critical (15%)</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 rounded-full"></span> High (20%)</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded-full"></span> Moderate (30%)</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Safe (35%)</div>
            </div>
          </div>

          {/* Panel 3: Rainfall Trend */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 text-white font-semibold">
              <Droplets size={18} className="text-blue-400" /> Avg Rainfall Trend
            </div>
            <div className="h-60">
               <RainfallChart data={rainfallData} />
            </div>
          </div>

          {/* Panel 4: Response Times */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 text-white font-semibold">
              <BarChart3 size={18} className="text-indigo-400" /> Avg Response Time
            </div>
            <div className="flex-1 flex flex-col justify-center h-60">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-white">18<span className="text-xl text-slate-500 ml-1">min</span></div>
                <div className="text-sm text-green-400 mt-2">↓ 12% from last month</div>
              </div>
              <div className="space-y-3">
                {['SDRF Teams', 'Medical', 'Heavy Mach.'].map((label, i) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>{label}</span>
                      <span>{[14, 22, 35][i]} min</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{width: `${[40, 60, 90][i]}%`}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel 5: Alerts Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 text-white font-semibold">
              <Activity size={18} className="text-purple-400" /> Alerts by Type
            </div>
            <div className="h-60 flex flex-col justify-center space-y-4">
               {[
                 { label: 'Rainfall Exceeded', count: 145, pct: 60, color: 'bg-blue-500' },
                 { label: 'Soil Moisture High', count: 68, pct: 28, color: 'bg-amber-500' },
                 { label: 'Ground Movement', count: 29, pct: 12, color: 'bg-red-500' },
               ].map(item => (
                 <div key={item.label} className="bg-slate-800/50 p-3 rounded-lg">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-sm font-medium text-slate-300">{item.label}</span>
                     <span className="text-sm font-bold text-white">{item.count}</span>
                   </div>
                   <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                     <div className={`h-full rounded-full ${item.color}`} style={{width: `${item.pct}%`}}></div>
                   </div>
                 </div>
               ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
