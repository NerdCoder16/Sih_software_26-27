import React from 'react';
import { AlertTriangle, Filter } from 'lucide-react';
import { AlertBanner } from '../ui/AlertBanner';
import { useAlertStore } from '@/stores/alertStore';
import { useAppStore } from '@/stores/appStore';
import { createDataProvider } from '@/services/dataProviders';

export function AlertPanel() {
  const { alerts, acknowledgeAlert } = useAlertStore();
  const { operatingMode } = useAppStore();

  const activeAlerts = alerts.filter(a => a.status !== 'RESOLVED');
  const alertList = activeAlerts.length > 0 ? activeAlerts : [
    { id: 'alt-1', severity: 'CRITICAL' as const, title: 'High Risk: Sohra Slope Zone', description: 'Soil moisture exceeded 85%. Ground movement detected.', source: 'SYSTEM', timestamp: new Date(), status: 'ACTIVE' as const },
    { id: 'alt-2', severity: 'HIGH' as const, title: 'Rainfall Threshold Exceeded', description: 'Heavy continuous rainfall expected in next 24hrs on NH-40.', source: 'SYSTEM', timestamp: new Date(), status: 'ACTIVE' as const },
  ];

  const handleAcknowledge = async (id: string) => {
    acknowledgeAlert(id, 'Command Officer');
    try {
      const provider = createDataProvider(operatingMode);
      await provider.acknowledgeAlert(id);
    } catch (err) {
      console.warn('Failed to persist alert acknowledgement:', err);
    }
  };

  const getSeverityVariant = (severity: string): 'error' | 'warning' | 'info' => {
    if (severity === 'CRITICAL' || severity === 'HIGH') return 'error';
    if (severity === 'MODERATE' || severity === 'MEDIUM') return 'warning';
    return 'info';
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800">
      <div className="p-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-200">Active Alerts</h2>
          <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
            {alertList.filter(a => a.status === 'ACTIVE').length}
          </span>
        </div>
        <button className="p-1 hover:bg-slate-800 rounded text-slate-400">
          <Filter className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {alertList.map(alert => (
          <AlertBanner 
            key={alert.id}
            severity={getSeverityVariant(alert.severity)}
            title={alert.title}
            message={alert.description || ''}
            timestamp={alert.timestamp}
            onAcknowledge={() => handleAcknowledge(alert.id)}
          />
        ))}
      </div>
    </div>
  );
}
