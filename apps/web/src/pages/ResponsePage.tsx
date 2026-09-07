import React, { useState } from 'react';
import { useResourceStore } from '@/stores/resourceStore';
import { useIncidentStore } from '@/stores/incidentStore';
import { mockResources } from '@/services/mockData';
import { ResourceDispatchModal } from '@/components/response/ResourceDispatchModal';
import { Truck, Users, Activity, Cross, Navigation, Map as MapIcon } from 'lucide-react';

export const ResponsePage = () => {
  const { resources } = useResourceStore();
  const { incidents } = useIncidentStore();

  const [filterType, setFilterType] = useState('ALL');
  const [selectedResourceId, setSelectedResourceId] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resourceList = resources.length > 0 ? resources : mockResources;

  const getIcon = (type: string) => {
    switch (type) {
      case 'SDRF_TEAM': return <Users size={18} />;
      case 'MEDICAL_TEAM': return <Cross size={18} />;
      case 'HEAVY_MACHINERY': return <Truck size={18} />;
      case 'HELICOPTER': return <Navigation size={18} />;
      default: return <Activity size={18} />;
    }
  };

  const filtered = filterType === 'ALL' 
    ? resourceList 
    : resourceList.filter(r => r.type === filterType);

  const types = ['ALL', 'SDRF_TEAM', 'MEDICAL_TEAM', 'HEAVY_MACHINERY', 'HELICOPTER'];

  const handleOpenDispatch = (resourceId: string) => {
    setSelectedResourceId(resourceId);
    setIsModalOpen(true);
  };

  const availableCount = resourceList.filter(r => r.status === 'AVAILABLE').length;
  const activeIncidentCount = incidents.filter(i => i.status !== 'CLOSED').length || 3;

  return (
    <div className="flex h-full w-full bg-slate-950 text-slate-200">
      <ResourceDispatchModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialResourceId={selectedResourceId}
      />

      {/* Left Panel - Resource List */}
      <div className="w-96 border-r border-slate-800 bg-slate-900 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white mb-4">Resources</h2>
          <div className="flex flex-wrap gap-2">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  filterType === type 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.map(res => (
            <div key={res.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-500 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-white font-medium">
                  {getIcon(res.type)}
                  <span>{res.name}</span>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
                  res.status === 'AVAILABLE' ? 'bg-green-500/20 text-green-400' :
                  res.status === 'DISPATCHED' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-amber-500/20 text-amber-400'
                }`}>
                  {res.status}
                </span>
              </div>
              <div className="text-sm text-slate-400 mb-3 flex items-center gap-1">
                <MapIcon size={14} /> {res.district || 'NER Region'} District
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => handleOpenDispatch(res.id)}
                  className="px-3 py-1.5 text-xs font-medium rounded bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                >
                  Details
                </button>
                {res.status === 'AVAILABLE' && (
                  <button 
                    onClick={() => handleOpenDispatch(res.id)}
                    className="px-3 py-1.5 text-xs font-medium rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                  >
                    Dispatch
                  </button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              No resources found for this type.
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Dispatch View */}
      <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-8 text-center border-l border-slate-800/50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-slate-950" style={{ backgroundSize: '20px 20px', backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)'}}></div>
        
        <div className="relative z-10 bg-slate-900/80 backdrop-blur border border-slate-800 p-8 rounded-2xl max-w-md w-full">
          <Truck size={48} className="mx-auto text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Resource Dispatch Map</h2>
          <p className="text-slate-400 mb-6">Select an available resource from the list to assign it to an active incident.</p>
          
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-slate-800 rounded p-3">
              <div className="text-xs text-slate-500 mb-1">Available Resources</div>
              <div className="text-xl font-bold text-green-400">{availableCount}</div>
            </div>
            <div className="bg-slate-800 rounded p-3">
              <div className="text-xs text-slate-500 mb-1">Active Incidents</div>
              <div className="text-xl font-bold text-amber-400">{activeIncidentCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
