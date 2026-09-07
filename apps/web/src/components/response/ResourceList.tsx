import React, { useState } from 'react';
import { StatusBadge } from '../ui/StatusBadge';
import { Truck, MapPin } from 'lucide-react';
import { useResourceStore } from '@/stores/resourceStore';
import { mockResources } from '@/services/mockData';
import { ResourceDispatchModal } from './ResourceDispatchModal';

export function ResourceList() {
  const { resources: storeResources } = useResourceStore();
  const [selectedResourceId, setSelectedResourceId] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resources = storeResources.length > 0 ? storeResources : mockResources;

  const handleOpenDispatch = (resourceId: string) => {
    setSelectedResourceId(resourceId);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-3 p-3">
      <ResourceDispatchModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialResourceId={selectedResourceId}
      />

      {resources.map(res => (
        <div key={res.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center">
                <Truck className="w-4 h-4 text-slate-300" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">{res.name}</h4>
                <span className="text-xs text-slate-400">{res.type.replace('_', ' ')}</span>
              </div>
            </div>
            <StatusBadge status={res.status} size="sm" />
          </div>
          <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t border-slate-700/50">
            <span className="text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3"/> {res.district || 'NER Base'}
            </span>
            {res.status === 'AVAILABLE' && (
              <button 
                onClick={() => handleOpenDispatch(res.id)}
                className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors"
              >
                Dispatch
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
