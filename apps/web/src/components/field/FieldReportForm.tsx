import React from 'react';
import { Camera, MapPin, Send } from 'lucide-react';

export function FieldReportForm() {
  return (
    <div className="p-4 bg-slate-900 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-slate-100 mb-4">New Field Report</h2>
      <div className="space-y-4 flex-1 overflow-y-auto">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Report Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-emerald-900/50 border border-emerald-500/50 text-emerald-400 p-2 rounded text-sm font-medium">Observation</button>
            <button className="bg-slate-800 border border-slate-700 text-slate-400 p-2 rounded text-sm font-medium">Incident</button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
          <textarea className="w-full h-24 bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-200 resize-none" placeholder="Describe the situation..."></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Severity (1-5)</label>
          <input type="range" min="1" max="5" defaultValue="3" className="w-full accent-emerald-500" />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Low</span>
            <span>Critical</span>
          </div>
        </div>
        <div className="bg-slate-950 border border-slate-700 rounded p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <MapPin className="w-4 h-4 text-emerald-500" />
            27.3314° N, 88.6138° E
          </div>
          <span className="text-xs text-emerald-500">Auto-filled</span>
        </div>
        <button className="w-full border border-dashed border-slate-600 bg-slate-800/50 text-slate-400 p-4 rounded flex flex-col items-center justify-center gap-2 hover:bg-slate-800 hover:text-slate-300 transition-colors">
          <Camera className="w-6 h-6" />
          <span className="text-sm">Add Photo / Video</span>
        </button>
      </div>
      <div className="pt-4 mt-auto">
        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded flex items-center justify-center gap-2">
          <Send className="w-4 h-4" /> Submit Report
        </button>
      </div>
    </div>
  );
}
