import { RiskZone, Alert, Incident, Sensor, Resource, Shelter, EvacuationRoute } from '@/types';
import { mockZones, mockAlerts, mockIncidents, mockSensors, mockResources, mockShelters, mockEvacuationRoutes } from './mockData';

export interface DataProvider {
  getZones(): Promise<RiskZone[]>;
  getAlerts(): Promise<Alert[]>;
  getIncidents(): Promise<Incident[]>;
  getSensors(): Promise<Sensor[]>;
  getResources(): Promise<Resource[]>;
  getShelters(): Promise<Shelter[]>;
  getEvacuationRoutes(): Promise<EvacuationRoute[]>;
  dispatchResource(resourceId: string, incidentId: string): Promise<{ success: boolean; data?: Resource; message?: string }>;
  acknowledgeAlert(alertId: string): Promise<{ success: boolean; data?: Alert; message?: string }>;
  transitionIncident(incidentId: string, newStage: string): Promise<{ success: boolean; data?: Incident; message?: string }>;
  createIncident(payload: Partial<Incident>): Promise<{ success: boolean; data?: Incident; message?: string }>;
  submitFieldReport(payload: any): Promise<{ success: boolean; data?: any; message?: string }>;
  postSensorReading(payload: any): Promise<{ success: boolean; data?: any; message?: string }>;
  controlSimulation(command: string, speed?: number): Promise<{ success: boolean; data?: any; message?: string }>;
}

class MockDataProvider implements DataProvider {
  async getZones() { return [...mockZones]; }
  async getAlerts() { return [...mockAlerts]; }
  async getIncidents() { return [...mockIncidents]; }
  async getSensors() { return [...mockSensors]; }
  async getResources() { return [...mockResources]; }
  async getShelters() { return [...mockShelters]; }
  async getEvacuationRoutes() { return [...mockEvacuationRoutes]; }

  async dispatchResource(resourceId: string, incidentId: string) {
    const res = mockResources.find(r => r.id === resourceId);
    if (res) {
      res.status = 'DISPATCHED';
      res.assignedIncidentId = incidentId;
      return { success: true, data: res, message: `Resource ${res.name} dispatched` };
    }
    return { success: false, message: 'Resource not found' };
  }

  async acknowledgeAlert(alertId: string) {
    const alt = mockAlerts.find(a => a.id === alertId);
    if (alt) {
      alt.status = 'ACKNOWLEDGED';
      alt.acknowledgedBy = 'Command Officer';
      alt.acknowledgedAt = new Date();
      return { success: true, data: alt, message: 'Alert acknowledged' };
    }
    return { success: false, message: 'Alert not found' };
  }

  async transitionIncident(incidentId: string, newStage: string) {
    const inc = mockIncidents.find(i => i.id === incidentId);
    if (inc) {
      inc.status = newStage as any;
      return { success: true, data: inc, message: `Incident updated to ${newStage}` };
    }
    return { success: false, message: 'Incident not found' };
  }

  async createIncident(payload: Partial<Incident>) {
    const newInc: Incident = {
      id: `inc-${Date.now()}`,
      title: payload.title || 'New Landslide Incident',
      description: payload.description || 'Ground movement reported',
      severity: payload.severity || 'MAJOR',
      status: 'DETECTED',
      zoneId: payload.zoneId || 'z1',
      coordinates: payload.coordinates || [91.7333, 25.2667],
      reportedAt: new Date(),
      populationAffected: payload.populationAffected || 500,
      roadsAffected: payload.roadsAffected || 1,
      casualties: 0,
      injuries: 0,
      structuresDamaged: 0,
      assignedResources: []
    };
    mockIncidents.unshift(newInc);
    return { success: true, data: newInc, message: 'Incident created' };
  }

  async submitFieldReport(payload: any) {
    return { success: true, data: { id: `fr-${Date.now()}`, ...payload }, message: 'Field report submitted' };
  }

  async postSensorReading(payload: any) {
    return { success: true, data: payload, message: 'Reading ingested' };
  }

  async controlSimulation(command: string, speed?: number) {
    return { success: true, data: { command, speed }, message: `Simulation ${command}` };
  }
}

class LiveDataProvider implements DataProvider {
  private baseUrl = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000/api/v1';

  private async fetchApi<T>(endpoint: string, fallback: T): Promise<T> {
    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`);
      if (!res.ok) {
        console.warn(`[LiveDataProvider] API ${endpoint} returned HTTP ${res.status}`);
        return fallback;
      }
      const json = await res.json();
      return json.data !== undefined ? json.data : json;
    } catch (err) {
      console.warn(`[LiveDataProvider] Network error fetching ${endpoint}:`, err);
      return fallback;
    }
  }

  private async postApi<T>(endpoint: string, body: any): Promise<{ success: boolean; data?: T; message?: string }> {
    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, message: json.detail || json.message || 'API Request failed' };
      }
      return { success: true, data: json.data, message: json.message };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error' };
    }
  }

  async getZones(): Promise<RiskZone[]> {
    return this.fetchApi<RiskZone[]>('/zones', mockZones);
  }

  async getAlerts(): Promise<Alert[]> {
    return this.fetchApi<Alert[]>('/alerts', mockAlerts);
  }

  async getIncidents(): Promise<Incident[]> {
    return this.fetchApi<Incident[]>('/incidents', mockIncidents);
  }

  async getSensors(): Promise<Sensor[]> {
    return this.fetchApi<Sensor[]>('/sensors', mockSensors);
  }

  async getResources(): Promise<Resource[]> {
    return this.fetchApi<Resource[]>('/resources', mockResources);
  }

  async getShelters(): Promise<Shelter[]> {
    return this.fetchApi<Shelter[]>('/shelters', mockShelters);
  }

  async getEvacuationRoutes(): Promise<EvacuationRoute[]> {
    return this.fetchApi<EvacuationRoute[]>('/evacuation-routes', mockEvacuationRoutes);
  }

  async dispatchResource(resourceId: string, incidentId: string) {
    return this.postApi<Resource>(`/resources/${resourceId}/dispatch`, { incidentId });
  }

  async acknowledgeAlert(alertId: string) {
    return this.postApi<Alert>(`/alerts/${alertId}/acknowledge`, {});
  }

  async transitionIncident(incidentId: string, newStage: string) {
    return this.postApi<Incident>(`/incidents/${incidentId}/transition`, { stage: newStage, actor: 'Command Officer' });
  }

  async createIncident(payload: Partial<Incident>) {
    return this.postApi<Incident>('/incidents', payload);
  }

  async submitFieldReport(payload: any) {
    return this.postApi<any>('/field-reports', payload);
  }

  async postSensorReading(payload: any) {
    return this.postApi<any>('/sensors/readings', payload);
  }

  async controlSimulation(command: string, speed?: number) {
    return this.postApi<any>('/simulation/control', { command, speed });
  }
}

export function createDataProvider(mode: 'LIVE' | 'DEMO'): DataProvider {
  return mode === 'LIVE' ? new LiveDataProvider() : new MockDataProvider();
}
