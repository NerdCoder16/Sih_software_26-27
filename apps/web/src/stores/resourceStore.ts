import { create } from 'zustand';
import { Resource, ResourceStatus } from '@/types';

interface ResourceState {
  resources: Resource[];
  setResources: (resources: Resource[]) => void;
  dispatchResource: (resourceId: string, incidentId: string) => void;
  updateResourceStatus: (id: string, status: ResourceStatus) => void;
}

export const useResourceStore = create<ResourceState>((set) => ({
  resources: [],
  setResources: (resources) => set({ resources }),
  dispatchResource: (resourceId, incidentId) => set((state) => ({
    resources: state.resources.map(r => 
      r.id === resourceId 
        ? { ...r, status: 'DISPATCHED', assignedIncidentId: incidentId } 
        : r
    )
  })),
  updateResourceStatus: (id, status) => set((state) => ({
    resources: state.resources.map(r => r.id === id ? { ...r, status } : r)
  }))
}));
