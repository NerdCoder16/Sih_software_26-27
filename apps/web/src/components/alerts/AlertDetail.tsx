import React from 'react';
import { ShieldAlert, Check } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

export function AlertDetail({ alert }: { alert: any }) {
  if (!alert) return <div>No alert selected</div>;
  
  return (
    <div className="p-4 flex flex-col h-full gap-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-bold text-slate-100">{alert.title}</h2>
        </div>
        <StatusBadge status={alert.severity} variant="outline" />
      </div>
      <div className="bg-slate-800/50 border border-slate-700 p-3 rounded text-sm text-slate-300">
        {alert.message}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-slate-200 mb-2">Recommended Actions</h3>
        <ul className="space-y-2">
          <li className="flex gap-2 text-sm text-slate-400"><Check className="w-4 h-4 text-emerald-500" /> Dispatch scout team</li>
          <li className="flex gap-2 text-sm text-slate-400"><Check className="w-4 h-4 text-emerald-500" /> Prepare shelters in Zone B</li>
        </ul>
      </div>
      <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded">
        Acknowledge Alert
      </button>
    </div>
  );
}
