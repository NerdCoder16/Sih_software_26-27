import React from 'react';

export function IncidentTimeline() {
  const events = [
    { id: 1, time: '10:00 AM', desc: 'Incident reported by citizen', actor: 'System' },
    { id: 2, time: '10:05 AM', desc: 'Severity upgraded to CRITICAL', actor: 'Operator A' },
    { id: 3, time: '10:15 AM', desc: 'SDRF Team dispatched', actor: 'Dispatcher' },
  ];

  return (
    <div className="space-y-4">
      {events.map((ev, i) => (
        <div key={ev.id} className="relative pl-6 pb-4">
          {i !== events.length - 1 && <div className="absolute left-2.5 top-3 w-px h-full bg-slate-700"></div>}
          <div className="absolute left-1.5 top-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-slate-900"></div>
          <div className="text-xs text-slate-500 mb-1">{ev.time} • {ev.actor}</div>
          <div className="text-sm text-slate-300">{ev.desc}</div>
        </div>
      ))}
    </div>
  );
}
