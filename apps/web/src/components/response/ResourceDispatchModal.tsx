import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { MapPin, Truck, AlertCircle, Loader2 } from 'lucide-react';
import { useResourceStore } from '@/stores/resourceStore';
import { useIncidentStore } from '@/stores/incidentStore';
import { useAppStore } from '@/stores/appStore';
import { createDataProvider } from '@/services/dataProviders';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialResourceId?: string;
  initialIncidentId?: string;
}

export function ResourceDispatchModal({ isOpen, onClose, initialResourceId, initialIncidentId }: Props) {
  const { resources, dispatchResource: dispatchInStore } = useResourceStore();
  const { incidents } = useIncidentStore();
  const { operatingMode } = useAppStore();

  const [selectedResourceId, setSelectedResourceId] = useState<string>('');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
      
      const availableResources = resources.filter(r => r.status === 'AVAILABLE' || r.id === initialResourceId);
      const activeIncidents = incidents.filter(i => i.status !== 'CLOSED');

      setSelectedResourceId(initialResourceId || availableResources[0]?.id || resources[0]?.id || '');
      setSelectedIncidentId(initialIncidentId || activeIncidents[0]?.id || incidents[0]?.id || 'inc-1');
    }
  }, [isOpen, initialResourceId, initialIncidentId, resources, incidents]);

  const handleConfirmDispatch = async () => {
    if (!selectedResourceId || !selectedIncidentId) {
      setErrorMessage('Please select both a resource and an incident.');
      return;
    }

    const res = resources.find(r => r.id === selectedResourceId);
    if (res && res.status === 'DISPATCHED') {
      setErrorMessage('This resource is already dispatched.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const provider = createDataProvider(operatingMode);
      const response = await provider.dispatchResource(selectedResourceId, selectedIncidentId);

      if (response.success) {
        dispatchInStore(selectedResourceId, selectedIncidentId);
        setSuccessMessage(response.message || 'Resource dispatched successfully.');
        setTimeout(() => {
          setIsSubmitting(false);
          onClose();
        }, 800);
      } else {
        setErrorMessage(response.message || 'Failed to dispatch resource.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred during dispatch.');
      setIsSubmitting(false);
    }
  };

  const availableResources = resources.filter(r => r.status === 'AVAILABLE' || r.id === initialResourceId);
  const activeIncidents = incidents.filter(i => i.status !== 'CLOSED');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dispatch Emergency Resource">
      <div className="space-y-4">
        {errorMessage && (
          <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg text-xs text-green-400 font-medium">
            {successMessage}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Select Resource</label>
          <select 
            value={selectedResourceId}
            onChange={(e) => setSelectedResourceId(e.target.value)}
            disabled={isSubmitting}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:border-blue-500 outline-none"
          >
            {availableResources.map(r => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.type.replace('_', ' ')}) - {r.status}
              </option>
            ))}
            {availableResources.length === 0 && (
              <option value="">No available resources</option>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Destination Incident</label>
          <select 
            value={selectedIncidentId}
            onChange={(e) => setSelectedIncidentId(e.target.value)}
            disabled={isSubmitting}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:border-blue-500 outline-none"
          >
            {activeIncidents.map(i => (
              <option key={i.id} value={i.id}>
                {i.id}: {i.title} [{i.severity}]
              </option>
            ))}
            {activeIncidents.length === 0 && (
              <option value="inc-1">INC-001: Landslide on NH-40 Corridor</option>
            )}
          </select>
        </div>

        <div className="bg-slate-800/80 p-3 rounded-lg text-sm text-slate-300 border border-slate-700/50">
          <div className="flex justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><MapPin className="w-3.5 h-3.5 text-slate-400"/> Calculated Distance</span>
            <span className="font-mono text-xs text-slate-200">14.2 km</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><Truck className="w-3.5 h-3.5 text-slate-400"/> Est. Time of Arrival</span>
            <span className="text-emerald-400 font-mono text-xs font-semibold">28 mins</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button 
            type="button"
            onClick={onClose} 
            disabled={isSubmitting}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleConfirmDispatch}
            disabled={isSubmitting || !selectedResourceId || !selectedIncidentId}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Dispatching...
              </>
            ) : (
              'Confirm Dispatch'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
