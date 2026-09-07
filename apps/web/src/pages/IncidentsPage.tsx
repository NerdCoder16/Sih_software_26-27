import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidentStore } from '@/stores/incidentStore';
import { mockIncidents, mockZones } from '@/services/mockData';
import { formatTimestamp, formatPopulation } from '@/utils/format';
import { AlertCircle, MapPin, Users, Activity } from 'lucide-react';

export const IncidentsPage = () => {
  const navigate = useNavigate();
  const { incidents: storeIncidents } = useIncidentStore();
  const [statusFilter, setStatusFilter] = useState('ALL');

  const incidentsList = storeIncidents.length > 0 ? storeIncidents : mockIncidents;

  const filtered = statusFilter === 'ALL' 
    ? incidentsList 
    : statusFilter === 'ACTIVE'
      ? incidentsList.filter(i => i.status !== 'CLOSED')
      : incidentsList.filter(i => i.status === 'CLOSED');

  return (
    <div className="h-full bg-slate-950 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Incident Management</h1>
          
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            {['ALL', 'ACTIVE', 'CLOSED'].map(status => {
              const count = status === 'ALL' 
                ? incidentsList.length 
                : status === 'ACTIVE'
                  ? incidentsList.filter(i => i.status !== 'CLOSED').length
                  : incidentsList.filter(i => i.status === 'CLOSED').length;

              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    statusFilter === status 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {status} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(incident => {
            const zone = mockZones.find(z => z.id === incident.zoneId);

            return (
              <div 
                key={incident.id}
                onClick={() => navigate(`/incidents/${incident.id}`)}
                className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Activity size={18} className="text-slate-400" />
                    <span className="text-xs font-mono text-slate-500">{incident.id}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${
                      incident.severity === 'CATASTROPHIC' || incident.severity === 'SEVERE' ? 'bg-red-500/20 text-red-400' :
                      incident.severity === 'MAJOR' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {incident.severity}
                    </span>
                    <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${
                      incident.status !== 'CLOSED' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-slate-700/50 text-slate-400'
                    }`}>
                      {incident.status}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 min-h-[56px]">{incident.title}</h3>
                
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-slate-500" />
                    <span>{zone?.district || 'NER Region'} District</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-slate-500" />
                    <span>{formatTimestamp(incident.reportedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-slate-500" />
                    <span>{formatPopulation(incident.populationAffected || 0)} affected</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No incidents match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};
