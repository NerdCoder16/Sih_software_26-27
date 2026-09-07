import React from 'react';
import { useAppStore } from '@/stores/appStore';
import { Settings, Globe, Map, Bell, Info } from 'lucide-react';

export const SettingsPage = () => {
  const { operatingMode, toggleMode } = useAppStore();

  return (
    <div className="h-full bg-slate-950 p-6 overflow-y-auto text-slate-200">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
        
        {/* Section: Mode */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-3">
            <Settings className="text-blue-500" size={20} />
            <h2 className="text-lg font-bold text-white">Operating Mode</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white text-lg">Current Mode: {operatingMode}</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-lg">
                  DEMO mode uses simulated data and scenarios. LIVE mode connects to real production sensors and databases.
                </p>
              </div>
              <button 
                onClick={toggleMode}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${operatingMode === 'LIVE' ? 'bg-red-500' : 'bg-slate-600'}`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${operatingMode === 'LIVE' ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
            {operatingMode === 'LIVE' && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded text-sm text-red-400">
                Warning: You are in LIVE mode. Actions taken will affect real production data and dispatch actual resources.
              </div>
            )}
          </div>
        </div>

        {/* Section: Language */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-3">
            <Globe className="text-blue-500" size={20} />
            <h2 className="text-lg font-bold text-white">Localization</h2>
          </div>
          <div className="p-6">
            <label className="block text-sm font-medium text-slate-400 mb-2">System Language</label>
            <select className="w-full max-w-md bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500">
              <option>English</option>
              <option>Hindi</option>
              <option>Assamese</option>
              <option>Bengali</option>
              <option>Nepali</option>
              <option>Manipuri</option>
              <option>Mizo</option>
              <option>Khasi</option>
            </select>
          </div>
        </div>

        {/* Section: Map */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-3">
            <Map className="text-blue-500" size={20} />
            <h2 className="text-lg font-bold text-white">Map Preferences</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Default Base Layer</label>
              <select className="w-full max-w-md bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500">
                <option>Satellite (High Res)</option>
                <option>Terrain / Topographical</option>
                <option>Street Map Dark</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Default Focus Area</label>
              <select className="w-full max-w-md bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500">
                <option>North East Region (Overview)</option>
                <option>Nagaland</option>
                <option>Assam</option>
                <option>Meghalaya</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section: About */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-12">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-3">
            <Info className="text-blue-500" size={20} />
            <h2 className="text-lg font-bold text-white">About NER-EWRS</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 max-w-md gap-y-2 text-sm">
              <div className="text-slate-400">Version</div>
              <div className="font-mono text-white">v2.4.1 (Build 8902)</div>
              <div className="text-slate-400">Environment</div>
              <div className="font-mono text-white">Production</div>
              <div className="text-slate-400">UI Framework</div>
              <div className="font-mono text-white">React 18 / Tailwind v4</div>
            </div>
            <div className="mt-6 text-xs text-slate-500">
              © 2026 NER Landslide Early Warning & Response System. All rights reserved.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
