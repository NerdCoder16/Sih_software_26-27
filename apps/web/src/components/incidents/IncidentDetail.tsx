import React from 'react';
import { StatusBadge } from '../ui/StatusBadge';
import { MapPin, Users, Clock } from 'lucide-react';

export function IncidentDetail({ incident }: { incident?: any }) {
  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 mb-2">Landslide on NH-10</h1>
          <div className="flex gap-3 text-sm text-slate-400">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> East Sikkim</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> Reported 10m ago</span>
          </div>
        </div>
        <div className="flex gap-2">
          <StatusBadge status="ACTIVE" />
          <StatusBadge status="CRITICAL" variant="outline" />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-slate-800/50 p-4 rounded border border-slate-700">
          <h3 className="font-semibold text-slate-200 mb-2">Description</h3>
          <p className="text-sm text-slate-400">Major landslide blocking NH-10. Estimated 500 cubic meters of debris. 3 vehicles trapped. Immediate medical and excavation assistance required.</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded border border-slate-700">
          <h3 className="font-semibold text-slate-200 mb-2">Assigned Resources</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 flex items-center gap-1"><Users className="w-4 h-4"/> SDRF Team Alpha</span>
              <span className="text-teal-400">En Route</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 flex items-center gap-1"><Users className="w-4 h-4"/> Medical Unit 2</span>
              <span className="text-amber-400">Preparing</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm font-medium transition-colors">Update Status</button>
        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm font-medium transition-colors">Assign Resources</button>
      </div>
    </div>
  );
}
