import React from 'react';

export function SimulationEventLog() {
  const events = [
    { id: 1, time: 'T+02:15', type: 'system', msg: 'Rainfall thresholds exceeded in Zone A' },
    { id: 2, time: 'T+02:16', type: 'alert', msg: 'Automatic Warning SMS dispatched to 2,450 residents' },
    { id: 3, time: 'T+03:00', type: 'incident', msg: 'Simulated ground movement detected via virtual sensors' },
  ];

  return (
    <div className="bg-slate-900 flex flex-col h-full border-l border-slate-700/50">
      <div className="p-3 border-b border-slate-700/50 font-semibold text-sm text-slate-200">
        Simulation Event Log
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {events.map(ev => (
          <div key={ev.id} className="text-xs p-2 rounded bg-slate-800/50 border border-slate-700/30 flex gap-3 font-mono">
            <span className="text-slate-500 shrink-0">{ev.time}</span>
            <span className={`
              ${ev.type === 'alert' ? 'text-amber-400' : ''}
              ${ev.type === 'incident' ? 'text-red-400' : ''}
              ${ev.type === 'system' ? 'text-blue-400' : ''}
            `}>
              {ev.msg}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
