import { create } from 'zustand';
import { Incident, IncidentEvent, IncidentStatus } from '@/types';

interface IncidentState {
  incidents: Incident[];
  events: Record<string, IncidentEvent[]>;
  selectedIncidentId: string | null;
  selectIncident: (id: string | null) => void;
  setIncidents: (incidents: Incident[]) => void;
  addIncident: (incident: Incident) => void;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  addIncidentEvent: (event: IncidentEvent) => void;
}

export const useIncidentStore = create<IncidentState>((set) => ({
  incidents: [],
  events: {},
  selectedIncidentId: null,
  selectIncident: (id) => set({ selectedIncidentId: id }),
  setIncidents: (incidents) => set({ incidents }),
  addIncident: (incident) => set((state) => ({
    incidents: [incident, ...state.incidents],
    events: { ...state.events, [incident.id]: [] }
  })),
  updateIncidentStatus: (id, status) => set((state) => ({
    incidents: state.incidents.map(inc => {
      if (inc.id !== id) return inc;
      const updates: Partial<Incident> = { status };
      if (status === 'VERIFIED' && !inc.verifiedAt) updates.verifiedAt = new Date();
      if (status === 'CLOSED' && !inc.closedAt) updates.closedAt = new Date();
      return { ...inc, ...updates };
    })
  })),
  addIncidentEvent: (event) => set((state) => ({
    events: {
      ...state.events,
      [event.incidentId]: [...(state.events[event.incidentId] || []), event]
    }
  }))
}));
