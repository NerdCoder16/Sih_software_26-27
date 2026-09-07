import React from 'react';

export function MapLegend() {
  return (
    <div className="absolute bottom-6 right-4 z-10 bg-slate-900/90 backdrop-blur border border-slate-700 rounded shadow-lg p-3 text-xs w-48">
      <div className="font-semibold text-slate-200 mb-2">Risk Level</div>
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-red-500/80 border border-red-500" />
            <span className="text-slate-300">Critical</span>
          </div>
          <span className="text-slate-500 font-mono">80-100</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-orange-500/80 border border-orange-500" />
            <span className="text-slate-300">High</span>
          </div>
          <span className="text-slate-500 font-mono">60-79</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-amber-500/80 border border-amber-500" />
            <span className="text-slate-300">Moderate</span>
          </div>
          <span className="text-slate-500 font-mono">40-59</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-teal-500/80 border border-teal-500" />
            <span className="text-slate-300">Low</span>
          </div>
          <span className="text-slate-500 font-mono">20-39</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500/80 border border-emerald-500" />
            <span className="text-slate-300">Safe</span>
          </div>
          <span className="text-slate-500 font-mono">0-19</span>
        </div>
      </div>
      
      <div className="font-semibold text-slate-200 mb-2">Map Symbols</div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-slate-800 border border-slate-600 rounded-full flex items-center justify-center text-[8px]">S</div>
          <span className="text-slate-400">Sensor</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-red-900 border border-red-500 rounded flex items-center justify-center text-[8px] text-red-400">!</div>
          <span className="text-slate-400">Incident</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-teal-900 border border-teal-500 rounded flex items-center justify-center text-[8px] text-teal-400">T</div>
          <span className="text-slate-400">Resource</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-emerald-900 border border-emerald-500 rounded flex items-center justify-center text-[8px] text-emerald-400">H</div>
          <span className="text-slate-400">Shelter</span>
        </div>
      </div>
    </div>
  );
}
