import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppStore } from '@/stores/appStore';
import { useRiskStore } from '@/stores/riskStore';
import { useAlertStore } from '@/stores/alertStore';
import { useIncidentStore } from '@/stores/incidentStore';
import { useSensorStore } from '@/stores/sensorStore';
import { useResourceStore } from '@/stores/resourceStore';
import { useEvacuationStore } from '@/stores/evacuationStore';
import { createDataProvider } from '@/services/dataProviders';
import { wsManager } from '@/services/websocketManager';

export function AppLayout() {
  const { operatingMode } = useAppStore();
  const setZones = useRiskStore((s) => s.setZones);
  const setAlerts = useAlertStore((s) => s.setAlerts);
  const addAlert = useAlertStore((s) => s.addAlert);
  const setIncidents = useIncidentStore((s) => s.setIncidents);
  const addIncident = useIncidentStore((s) => s.addIncident);
  const updateIncidentStatus = useIncidentStore((s) => s.updateIncidentStatus);
  const setSensors = useSensorStore((s) => s.setSensors);
  const updateSensorReading = useSensorStore((s) => s.updateSensorReading);
  const setResources = useResourceStore((s) => s.setResources);
  const dispatchResourceInStore = useResourceStore((s) => s.dispatchResource);
  const setShelters = useEvacuationStore((s) => s.setShelters);
  const setRoutes = useEvacuationStore((s) => s.setRoutes);

  // Global Data Hydration & Mode Sync
  useEffect(() => {
    const provider = createDataProvider(operatingMode);

    async function hydrate() {
      try {
        const [z, a, i, s, r, sh, rt] = await Promise.all([
          provider.getZones(),
          provider.getAlerts(),
          provider.getIncidents(),
          provider.getSensors(),
          provider.getResources(),
          provider.getShelters(),
          provider.getEvacuationRoutes(),
        ]);

        if (z?.length) setZones(z);
        if (a?.length) setAlerts(a);
        if (i?.length) setIncidents(i);
        if (s?.length) setSensors(s);
        if (r?.length) setResources(r);
        if (sh?.length) setShelters(sh);
        if (rt?.length) setRoutes(rt);
      } catch (err) {
        console.warn('[AppLayout] Data hydration error:', err);
      }
    }

    hydrate();

    // WebSocket Management for LIVE mode
    const isDemo = operatingMode === 'DEMO';
    wsManager.setMode(isDemo);

    if (!isDemo) {
      const wsUrl = (import.meta.env.VITE_WS_URL as string) || 'ws://localhost:8000/ws/live';
      wsManager.connect(wsUrl, 'demo-token');

      const handleSensorReading = (data: any) => {
        if (data.sensorId && data.value !== undefined) {
          updateSensorReading(data.sensorId, data.value, data.timestamp);
        }
      };

      const handleAlertCreated = (data: any) => {
        if (data.id && data.title) {
          addAlert(data);
        }
      };

      const handleIncidentCreated = (data: any) => {
        if (data.id) {
          addIncident(data);
        }
      };

      const handleIncidentUpdated = (data: any) => {
        if (data.id && data.status) {
          updateIncidentStatus(data.id, data.status);
        }
      };

      const handleResourceMoved = (data: any) => {
        if (data.id && data.assignedIncidentId) {
          dispatchResourceInStore(data.id, data.assignedIncidentId);
        }
      };

      wsManager.subscribe('SENSOR_READING', handleSensorReading);
      wsManager.subscribe('ALERT_CREATED', handleAlertCreated);
      wsManager.subscribe('INCIDENT_CREATED', handleIncidentCreated);
      wsManager.subscribe('INCIDENT_UPDATED', handleIncidentUpdated);
      wsManager.subscribe('RESOURCE_MOVED', handleResourceMoved);

      return () => {
        wsManager.unsubscribe('SENSOR_READING', handleSensorReading);
        wsManager.unsubscribe('ALERT_CREATED', handleAlertCreated);
        wsManager.unsubscribe('INCIDENT_CREATED', handleIncidentCreated);
        wsManager.unsubscribe('INCIDENT_UPDATED', handleIncidentUpdated);
        wsManager.unsubscribe('RESOURCE_MOVED', handleResourceMoved);
        wsManager.disconnect();
      };
    }
  }, [operatingMode, setZones, setAlerts, addAlert, setIncidents, addIncident, updateIncidentStatus, setSensors, updateSensorReading, setResources, dispatchResourceInStore, setShelters, setRoutes]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-200 selection:bg-slate-700 font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 overflow-auto relative">
          {operatingMode === 'DEMO' && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/50 via-amber-400/50 to-amber-500/50 z-50 pointer-events-none" />
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
