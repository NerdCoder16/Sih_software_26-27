import React from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

export function FieldReportList() {
  const reports = [
    { id: 'REP-01', type: 'Observation', desc: 'Minor rockfall noticed on highway slope.', sync: 'SYNCED', severity: 2 },
    { id: 'REP-02', type: 'Incident', desc: 'Road completely blocked.', sync: 'PENDING', severity: 5 },
  ];

  return (
    <div className="space-y-3 p-3">
      {reports.map(rep => (
        <div key={rep.id} className="bg-slate-800 border border-slate-700 p-3 rounded-lg flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">{rep.id}</span>
              <StatusBadge status={rep.type} size="sm" variant="outline" />
            </div>
            {rep.sync === 'SYNCED' ? (
              <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">Synced <RefreshCw className="w-3 h-3"/></span>
            ) : (
              <span className="text-[10px] text-amber-500 font-medium flex items-center gap-1">Pending <RefreshCw className="w-3 h-3"/></span>
            )}
          </div>
          <p className="text-sm text-slate-300">{rep.desc}</p>
          <div className="flex items-center justify-between mt-2">
             <div className="flex items-center gap-1 text-xs text-slate-500">
               <Camera className="w-3 h-3"/> 1 attachment
             </div>
             <div className="text-xs text-slate-400">Severity: {rep.severity}/5</div>
          </div>
        </div>
      ))}
    </div>
  );
}
