import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIncidentStore } from '@/stores/incidentStore';
import { useAppStore } from '@/stores/appStore';
import { mockIncidents, mockZones } from '@/services/mockData';
import { formatTimestamp } from '@/utils/format';
import { ResourceDispatchModal } from '@/components/response/ResourceDispatchModal';
import { Modal } from '@/components/ui/Modal';
import { createDataProvider } from '@/services/dataProviders';
import { ArrowLeft, MapPin, Clock, Users, AlertTriangle, Loader2 } from 'lucide-react';

const VALID_STAGES = [
  'DETECTED', 'ASSESSING', 'VERIFIED', 'DECLARED', 
  'RESPONDING', 'EVACUATING', 'RESCUE', 'CONTAINED', 'RECOVERY', 'CLOSED'
];

export const IncidentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { incidents, updateIncidentStatus } = useIncidentStore();
  const { operatingMode } = useAppStore();

  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>('VERIFIED');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionError, setTransitionError] = useState<string | null>(null);

  const incident = incidents.find(i => i.id === id) || mockIncidents.find(i => i.id === id);

  if (!incident) {
    return (
      <div className="p-8 text-white flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-bold mb-4">Incident not found</h2>
        <button onClick={() => navigate('/incidents')} className="text-blue-400 underline">
          Back to Incidents
        </button>
      </div>
    );
  }

  const zone = mockZones.find(z => z.id === incident.zoneId);
  const displayStages = ['DETECTED', 'VERIFIED', 'RESPONDING', 'CONTAINED', 'CLOSED'];
  const currentStageIdx = displayStages.indexOf(incident.status as string);

  const handleStageTransition = async () => {
    setIsTransitioning(true);
    setTransitionError(null);

    try {
      const provider = createDataProvider(operatingMode);
      const res = await provider.transitionIncident(incident.id, selectedStage);

      if (res.success) {
        updateIncidentStatus(incident.id, selectedStage as any);
        setIsStatusModalOpen(false);
      } else {
        setTransitionError(res.message || 'Failed to update incident stage.');
      }
    } catch (err: any) {
      setTransitionError(err.message || 'Error occurred during stage transition.');
    } finally {
      setIsTransitioning(false);
    }
  };

  return (
    <div className="h-full bg-slate-950 p-6 overflow-y-auto">
      <ResourceDispatchModal 
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        initialIncidentId={incident.id}
      />

      {/* Stage Transition Modal */}
      <Modal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} title="Update Incident Status">
        <div className="space-y-4">
          {transitionError && (
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-xs text-red-400">
              {transitionError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Target Stage</label>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              disabled={isTransitioning}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:border-blue-500 outline-none"
            >
              {VALID_STAGES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setIsStatusModalOpen(false)}
              disabled={isTransitioning}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleStageTransition}
              disabled={isTransitioning}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
            >
              {isTransitioning ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Updating...
                </>
              ) : (
                'Confirm Stage Change'
              )}
            </button>
          </div>
        </div>
      </Modal>

      <div className="max-w-5xl mx-auto space-y-6">
        <button 
          onClick={() => navigate('/incidents')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back to Incidents
        </button>

        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-mono text-slate-500">{incident.id}</span>
                <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${
                  incident.severity === 'CATASTROPHIC' || incident.severity === 'SEVERE' ? 'bg-red-500/20 text-red-400' :
                  incident.severity === 'MAJOR' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {incident.severity}
                </span>
                <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${
                  incident.status === 'RESPONDING' || incident.status === 'VERIFIED' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-amber-500/20 text-amber-400'
                }`}>
                  {incident.status}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{incident.title}</h1>
              <p className="text-slate-400">{incident.description}</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsStatusModalOpen(true)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Update Status
              </button>
              <button 
                onClick={() => setIsDispatchModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Dispatch Resource
              </button>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 z-0"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 z-0 transition-all duration-500" 
              style={{ width: `${Math.max(0, currentStageIdx) * 25}%` }}
            ></div>
            
            {displayStages.map((stage, idx) => (
              <div key={stage} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-4 border-slate-900 ${
                  idx < currentStageIdx ? 'bg-blue-600 text-white' : 
                  idx === currentStageIdx ? 'bg-blue-500 text-white ring-4 ring-blue-500/20' : 
                  'bg-slate-700 text-slate-400'
                }`}>
                  {idx + 1}
                </div>
                <span className={`text-xs font-semibold ${idx <= currentStageIdx ? 'text-slate-200' : 'text-slate-500'}`}>
                  {stage}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Grid Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Location & Impact</h3>
            
            <div className="flex items-start gap-3 text-slate-300">
              <MapPin size={20} className="text-slate-500 mt-0.5" />
              <div>
                <p className="font-medium text-white">{zone?.name || 'Assigned Zone'}</p>
                <p className="text-sm text-slate-400">
                  Lat: {incident.coordinates[1].toFixed(4)}, Lng: {incident.coordinates[0].toFixed(4)}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 text-slate-300">
              <Clock size={20} className="text-slate-500 mt-0.5" />
              <div>
                <p className="font-medium text-white">Reported At</p>
                <p className="text-sm text-slate-400">{formatTimestamp(incident.reportedAt)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-slate-300">
              <Users size={20} className="text-slate-500 mt-0.5" />
              <div>
                <p className="font-medium text-white">{(incident.populationAffected || 0).toLocaleString()} people affected</p>
                <p className="text-sm text-slate-400">Casualties: {incident.casualties || 0} | Injured: {incident.injuries || 0}</p>
              </div>
            </div>

            {incident.roadsAffected && incident.roadsAffected > 0 && (
              <div className="flex items-start gap-3 text-slate-300">
                <AlertTriangle size={20} className="text-slate-500 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Roads Affected</p>
                  <p className="text-sm text-slate-400">{incident.roadsAffected} transport corridors impacted</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2 mb-4">Event Timeline</h3>
            <div className="space-y-4">
              {(incident.timeline && incident.timeline.length > 0 ? incident.timeline : [
                { id: '1', recordedBy: 'Automated Early Warning', timestamp: incident.reportedAt, description: `Incident initialized in stage ${incident.status}` }
              ]).map((event, idx) => (
                <div key={event.id || idx} className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                      <span className="font-semibold text-slate-200">{event.recordedBy}</span>
                      <span>{formatTimestamp(event.timestamp)}</span>
                    </div>
                    <p className="text-sm text-slate-300">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
