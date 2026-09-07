import { create } from 'zustand';
import { EvacuationRoute, Shelter } from '@/types';

interface EvacuationState {
  routes: EvacuationRoute[];
  shelters: Shelter[];
  selectedRouteId: string | null;
  setRoutes: (routes: EvacuationRoute[]) => void;
  setShelters: (shelters: Shelter[]) => void;
  selectRoute: (id: string | null) => void;
  updateShelterOccupancy: (id: string, occupancy: number) => void;
}

export const useEvacuationStore = create<EvacuationState>((set) => ({
  routes: [],
  shelters: [],
  selectedRouteId: null,
  setRoutes: (routes) => set({ routes }),
  setShelters: (shelters) => set({ shelters }),
  selectRoute: (id) => set({ selectedRouteId: id }),
  updateShelterOccupancy: (id, occupancy) => set((state) => ({
    shelters: state.shelters.map(s => s.id === id ? { ...s, currentOccupancy: occupancy } : s)
  }))
}));
