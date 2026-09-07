import { create } from 'zustand';
import { Alert, AlertSeverity } from '@/types';

interface AlertState {
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  acknowledgeAlert: (id: string, user: string) => void;
  resolveAlert: (id: string) => void;
  getAlertsByLevel: (severity: AlertSeverity) => Alert[];
  setAlerts: (alerts: Alert[]) => void;
}

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: [],
  setAlerts: (alerts) => set({ alerts }),
  addAlert: (alert) => set((state) => ({
    alerts: [alert, ...state.alerts]
  })),
  acknowledgeAlert: (id, user) => set((state) => ({
    alerts: state.alerts.map(a => a.id === id ? { ...a, status: 'ACKNOWLEDGED', acknowledgedBy: user, acknowledgedAt: new Date() } : a)
  })),
  resolveAlert: (id) => set((state) => ({
    alerts: state.alerts.map(a => a.id === id ? { ...a, status: 'RESOLVED' } : a)
  })),
  getAlertsByLevel: (severity) => {
    return get().alerts.filter(a => a.severity === severity);
  }
}));
