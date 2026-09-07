import { create } from 'zustand';
import { RiskZone } from '@/types';

interface RiskState {
  zones: RiskZone[];
  selectedZoneId: string | null;
  loading: boolean;
  lastUpdated: Date;
  setZones: (zones: RiskZone[]) => void;
  selectZone: (id: string | null) => void;
  updateZone: (id: string, updates: Partial<RiskZone>) => void;
  getSelectedZone: () => RiskZone | undefined;
}

export const useRiskStore = create<RiskState>((set, get) => ({
  zones: [],
  selectedZoneId: null,
  loading: false,
  lastUpdated: new Date(),
  setZones: (zones) => set({ zones, lastUpdated: new Date() }),
  selectZone: (id) => set({ selectedZoneId: id }),
  updateZone: (id, updates) => set((state) => ({
    zones: state.zones.map((zone) => zone.id === id ? { ...zone, ...updates, lastUpdated: new Date() } : zone),
    lastUpdated: new Date()
  })),
  getSelectedZone: () => {
    const { zones, selectedZoneId } = get();
    return zones.find(z => z.id === selectedZoneId);
  }
}));
