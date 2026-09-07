import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvacuationStore } from '@/stores/evacuationStore';
import { mockEvacuationRoutes, mockShelters } from '@/services/mockData';
import { formatDistance, formatPopulation } from '@/utils/format';
import { Map, ArrowRight, Shield, AlertTriangle, Users, CheckCircle2 } from 'lucide-react';
import { EvacuationRoute } from '@/types';

export const EvacuationPage = () => {
  const navigate = useNavigate();
  const { routes: storeRoutes, shelters: storeShelters, selectRoute } = useEvacuationStore();
  const [declared, setDeclared] = useState(false);

  const routes = storeRoutes.length > 0 ? storeRoutes : mockEvacuationRoutes;
  const shelters = storeShelters.length > 0 ? storeShelters : mockShelters;

  const handleDeclareEvacuation = () => {
    setDeclared(true);
    setTimeout(() => setDeclared(false), 3000);
  };

  const handleViewMap = (route: EvacuationRoute) => {
    selectRoute(route.id);
    navigate('/command');
  };

  return (
    <div className="h-full bg-slate-950 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Evacuation Management</h1>
            <p className="text-slate-400 mt-1">Manage active evacuation routes and shelter capacities across North East India.</p>
          </div>
          <button 
            onClick={handleDeclareEvacuation}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {declared ? <CheckCircle2 size={18} className="text-green-300" /> : <Shield size={18} />}
            {declared ? 'Evacuation Declared!' : 'Declare Evacuation'}
          </button>
        </div>

        {declared && (
          <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-xl text-amber-300 text-sm">
            Automated evacuation protocol dispatched. Emergency alerts sent to local sirens and field response teams.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Routes */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Map size={20} className="text-blue-500" /> Pre-planned Routes
            </h2>
            
            <div className="grid gap-4">
              {routes.map(route => {
                const statusUpper = (route.status || 'active').toUpperCase();
                const destinationShelter = shelters.find(s => s.id === route.destinationShelterId);
                const distanceVal = route.distance || 15;

                return (
                  <div key={route.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                          statusUpper === 'ACTIVE' || statusUpper === 'OPEN' ? 'bg-green-500/20 text-green-400' :
                          statusUpper === 'BLOCKED' || statusUpper === 'COMPROMISED' ? 'bg-red-500/20 text-red-400' :
                          'bg-slate-700/50 text-slate-400'
                        }`}>
                          {statusUpper}
                        </span>
                        {route.riskLevel === 'HIGH' && (
                          <span className="flex items-center gap-1 text-red-400 text-xs font-medium">
                            <AlertTriangle size={12} /> High Risk Path
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-bold text-white flex items-center gap-3">
                        <span className="truncate max-w-[150px]">{route.originZoneId}</span>
                        <ArrowRight size={16} className="text-slate-500 shrink-0" />
                        <span className="truncate max-w-[150px]">{destinationShelter?.name || route.destinationShelterId}</span>
                      </h3>
                      
                      <div className="flex gap-4 mt-2 text-sm text-slate-400 font-mono">
                        <span>Dist: {formatDistance(distanceVal)}</span>
                        <span>ETA: {route.estimatedTimeMinutes} min</span>
                      </div>
                    </div>
                    
                    <div className="shrink-0 flex md:flex-col gap-2">
                      <button 
                        onClick={() => handleViewMap(route)}
                        className="flex-1 md:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
                      >
                        View Map
                      </button>
                      {statusUpper !== 'ACTIVE' && (
                        <button className="flex-1 md:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
                          Activate
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shelter Capacities */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users size={20} className="text-green-500" /> Shelter Status
            </h2>
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
              {shelters.map(shelter => {
                const percentFull = (shelter.currentOccupancy / shelter.capacity) * 100;
                let colorClass = 'bg-green-500';
                if (percentFull > 90) colorClass = 'bg-red-500';
                else if (percentFull > 75) colorClass = 'bg-amber-500';
                
                return (
                  <div key={shelter.id} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <h4 className="font-medium text-white truncate max-w-[180px]">{shelter.name}</h4>
                      <span className="text-xs font-mono text-slate-400">
                        {formatPopulation(shelter.currentOccupancy)} / {formatPopulation(shelter.capacity)}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${colorClass} transition-all`} style={{ width: `${Math.min(100, percentFull)}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
