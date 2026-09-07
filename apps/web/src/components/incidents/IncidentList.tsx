import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../ui/StatusBadge';
import { useIncidentStore } from '@/stores/incidentStore';
import { mockIncidents } from '@/services/mockData';
import { formatTimestamp } from '@/utils/format';

export function IncidentList() {
  const navigate = useNavigate();
  const { incidents: storeIncidents } = useIncidentStore();

  const incidents = storeIncidents.length > 0 ? storeIncidents : mockIncidents;

  return (
    <div className="space-y-2 p-2">
      {incidents.slice(0, 5).map(inc => (
        <div 
          key={inc.id} 
          onClick={() => navigate(`/incidents/${inc.id}`)}
          className="bg-slate-800 border border-slate-700 p-3 rounded-lg hover:border-slate-500 cursor-pointer transition-colors"
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-sm text-slate-200 line-clamp-1">{inc.title}</h4>
            <span className="text-xs text-slate-500 shrink-0 font-mono">
              {formatTimestamp(inc.reportedAt)}
            </span>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={inc.status} size="sm" />
            <StatusBadge status={inc.severity} size="sm" variant="outline" />
          </div>
        </div>
      ))}
    </div>
  );
}
