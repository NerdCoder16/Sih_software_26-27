import React, { useState } from 'react';
import { mockIncidents } from '@/services/mockData';
import { useAppStore } from '@/stores/appStore';
import { createDataProvider } from '@/services/dataProviders';
import { Map, FileText, CheckSquare, PlusCircle, WifiOff, MapPin, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export const FieldOperationsPage = () => {
  const { operatingMode } = useAppStore();
  const [activeTab, setActiveTab] = useState('REPORTS');

  const [reportType, setReportType] = useState('DAMAGE_ASSESSMENT');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [localReports, setLocalReports] = useState<any[]>([
    {
      id: 'fr-101',
      type: 'DAMAGE_ASSESSMENT',
      title: 'Road Blockage on NH-29',
      description: 'Landslide has completely blocked both lanes. Estimated 50m of debris. Heavy machinery required.',
      timestamp: '2 hrs ago',
      severity: 4
    },
    {
      id: 'fr-102',
      type: 'SITUATION_UPDATE',
      title: 'Sohra Slope Stabilization Watch',
      description: 'Runoff drains cleared. Small mudflows observed near bridge abutment.',
      timestamp: '4 hrs ago',
      severity: 2
    }
  ]);

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setSubmitError('Please enter a description for the field report.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      type: reportType,
      description,
      severity,
      coordinates: [94.11, 25.57],
      reportedBy: 'Ground Operator',
      incidentId: 'inc-1'
    };

    try {
      const provider = createDataProvider(operatingMode);
      const res = await provider.submitFieldReport(payload);

      if (res.success) {
        setSubmitSuccess(true);
        const newReport = {
          id: res.data?.id || `fr-${Date.now()}`,
          type: reportType,
          title: `${reportType.replace('_', ' ')} Report`,
          description,
          timestamp: 'Just now',
          severity
        };
        setLocalReports([newReport, ...localReports]);
        setDescription('');
        setTimeout(() => {
          setSubmitSuccess(false);
          setActiveTab('REPORTS');
        }, 1200);
      } else {
        setSubmitError(res.message || 'Failed to submit field report.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Network error submitting report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200">
      {/* Top Mobile-like Status Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex justify-between items-center text-xs">
        <div className="flex items-center gap-2 text-green-400">
          <MapPin size={14} />
          <span>GPS Active (25.57°N, 94.11°E)</span>
        </div>
        <div className="flex items-center gap-2 text-amber-500 font-mono">
          <WifiOff size={14} />
          <span>{operatingMode} MODE</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'MAP' && (
          <div className="h-full rounded-xl border border-slate-800 bg-slate-900 flex flex-col items-center justify-center text-slate-500">
            <Map size={64} className="mb-4 opacity-50" />
            <h2 className="text-xl font-medium mb-2">Field Map View</h2>
            <p className="text-sm">Interactive map with your location and assigned tasks.</p>
          </div>
        )}
        
        {activeTab === 'REPORTS' && (
          <div className="space-y-4 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-white mb-4">Recent Field Reports</h2>
            {localReports.map(report => (
              <div key={report.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold bg-blue-500/20 text-blue-400 px-2 py-1 rounded uppercase">
                    {report.type}
                  </span>
                  <span className="text-xs text-slate-500">{report.timestamp}</span>
                </div>
                <h3 className="font-semibold text-white mb-1">{report.title}</h3>
                <p className="text-sm text-slate-400">{report.description}</p>
                <div className="mt-3 flex gap-2">
                  <div className="w-12 h-12 bg-slate-800 rounded flex items-center justify-center text-xs text-slate-500">GPS</div>
                  <div className="w-12 h-12 bg-slate-800 rounded flex items-center justify-center text-xs text-slate-500">IMG</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'TASKS' && (
          <div className="space-y-4 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-white mb-4">Assigned Tasks</h2>
            {mockIncidents.slice(0, 2).map(task => (
              <div key={task.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-4">
                <div className="mt-1">
                  <div className="w-6 h-6 rounded-full border-2 border-slate-600 flex items-center justify-center"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{task.title}</h3>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-1">{task.description}</p>
                  <button className="mt-3 text-sm text-blue-400 font-medium">View Details →</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'NEW' && (
          <div className="max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">New Field Report</h2>
            
            {submitSuccess && (
              <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg text-sm text-green-400 flex items-center gap-2">
                <CheckCircle2 size={18} />
                <span>Field report submitted and logged successfully!</span>
              </div>
            )}

            {submitError && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-sm text-red-400 flex items-center gap-2">
                <AlertCircle size={18} />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Report Type</label>
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-blue-500"
                >
                  <option value="DAMAGE_ASSESSMENT">Damage Assessment</option>
                  <option value="SITUATION_UPDATE">Situation Update</option>
                  <option value="RESOURCE_REQUEST">Resource Request</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
                <div className="flex gap-2">
                  <input type="text" value="Lat: 25.57, Lng: 94.11" readOnly className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-400 outline-none" />
                  <button type="button" className="bg-slate-800 p-2.5 rounded-lg text-white"><MapPin size={20} /></button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Severity Level (1-5)</label>
                <input 
                  type="number" 
                  min={1} 
                  max={5} 
                  value={severity} 
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                <textarea 
                  rows={4} 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe ground observations, road blockages, debris volume..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-blue-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Photos / Video</label>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center text-slate-500 hover:border-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
                  <PlusCircle size={32} className="mx-auto mb-2" />
                  <span>Tap to add media</span>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors mt-4 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Report'
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Bottom Tab Bar */}
      <div className="bg-slate-900 border-t border-slate-800 flex">
        {[
          { id: 'MAP', icon: Map, label: 'Map' },
          { id: 'REPORTS', icon: FileText, label: 'Reports' },
          { id: 'TASKS', icon: CheckSquare, label: 'Tasks' },
          { id: 'NEW', icon: PlusCircle, label: 'New Report' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  );
};
