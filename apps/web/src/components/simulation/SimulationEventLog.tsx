import React, { useEffect, useState } from 'react';
import { useSimulationStore } from '@/stores/simulationStore';
import { useAlertStore } from '@/stores/alertStore';
import { useIncidentStore } from '@/stores/incidentStore';
import { useSensorStore } from '@/stores/sensorStore';
import { AlertCircle, ShieldAlert, Activity, CheckCircle2 } from 'lucide-react';

interface LogEntry {
  id: string;
  time: string;
  type: 'system' | 'alert' | 'incident' | 'telemetry';
  msg: string;
}

export function SimulationEventLog() {
  const { state } = useSimulationStore();
  const { alerts } = useAlertStore();
  const { incidents } = useIncidentStore();
  const { readings } = useSensorStore();

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', time: 'T+00:00:00', type: 'system', msg: 'Digital Twin initialized. Monitoring baseline environment.' }
  ]);

  // Log phase changes
  useEffect(() => {
    const hours = Math.floor(state.elapsedSeconds / 3600);
    const mins = Math.floor((state.elapsedSeconds % 3600) / 60);
    const secs = state.elapsedSeconds % 60;
    const timeStr = `T+${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const newLog: LogEntry = {
      id: `phase-${state.phase}-${Date.now()}`,
      time: timeStr,
      type: 'system',
      msg: `Phase Advanced: ${state.phase.replace('_', ' ')} (Speed: ${state.speed}x)`
    };

    setLogs((prev) => {
      if (prev.some(l => l.msg === newLog.msg)) return prev;
      return [newLog, ...prev.slice(0, 40)];
    });
  }, [state.phase, state.speed]);

  // Sync with alerts
  useEffect(() => {
    if (alerts.length === 0) return;
    const latestAlert = alerts[0];
    const hours = Math.floor(state.elapsedSeconds / 3600);
    const mins = Math.floor((state.elapsedSeconds % 3600) / 60);
    const secs = state.elapsedSeconds % 60;
    const timeStr = `T+${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const alertLog: LogEntry = {
      id: `alt-log-${latestAlert.id}`,
      time: timeStr,
      type: 'alert',
      msg: `ALERT [${latestAlert.severity}]: ${latestAlert.title}`
    };

    setLogs((prev) => {
      if (prev.some(l => l.id === alertLog.id)) return prev;
      return [alertLog, ...prev.slice(0, 40)];
    });
  }, [alerts]);

  // Sync with incidents
  useEffect(() => {
    if (incidents.length === 0) return;
    const latestInc = incidents[0];
    const hours = Math.floor(state.elapsedSeconds / 3600);
    const mins = Math.floor((state.elapsedSeconds % 3600) / 60);
    const secs = state.elapsedSeconds % 60;
    const timeStr = `T+${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const incLog: LogEntry = {
      id: `inc-log-${latestInc.id}`,
      time: timeStr,
      type: 'incident',
      msg: `INCIDENT [${latestInc.status}]: ${latestInc.title}`
    };

    setLogs((prev) => {
      if (prev.some(l => l.id === incLog.id)) return prev;
      return [incLog, ...prev.slice(0, 40)];
    });
  }, [incidents]);

  return (
    <div className="bg-slate-900 flex flex-col h-full">
      <div className="p-3 border-b border-slate-800 flex items-center justify-between font-semibold text-xs text-slate-200 uppercase tracking-wider">
        <span>Live Event Stream</span>
        <span className="text-[10px] text-purple-400 font-mono">{logs.length} Events</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {logs.map(ev => (
          <div key={ev.id} className="text-xs p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5 font-mono">
            <span className="text-slate-500 shrink-0 text-[11px] mt-0.5">{ev.time}</span>
            <div className="flex-1">
              <span className={`leading-relaxed ${
                ev.type === 'alert' ? 'text-amber-400 font-semibold' :
                ev.type === 'incident' ? 'text-red-400 font-semibold' :
                ev.type === 'telemetry' ? 'text-cyan-400' : 'text-purple-300'
              }`}>
                {ev.msg}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
