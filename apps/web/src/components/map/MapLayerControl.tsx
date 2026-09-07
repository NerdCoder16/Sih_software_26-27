import React from 'react';
import { Layers } from 'lucide-react';

interface MapLayerControlProps {
  layers: Record<string, boolean>;
  onChange: (layerId: string, visible: boolean) => void;
}

export function MapLayerControl({ layers, onChange }: MapLayerControlProps) {
  const layerConfigs = [
    { id: 'risk-zones', label: 'Risk Zones', color: 'bg-orange-500' },
    { id: 'sensors', label: 'Sensors', color: 'bg-blue-500' },
    { id: 'incidents', label: 'Incidents', color: 'bg-red-500' },
    { id: 'resources', label: 'Resources', color: 'bg-teal-500' },
    { id: 'shelters', label: 'Shelters', color: 'bg-emerald-500' },
    { id: 'evacuation-routes', label: 'Evacuation Routes', color: 'bg-purple-500' },
    { id: 'rainfall', label: 'Rainfall Overlay', color: 'bg-cyan-500' },
  ];

  return (
    <div className="absolute top-4 right-4 z-10 bg-slate-900/90 backdrop-blur border border-slate-700 rounded shadow-lg w-48">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-700/50 bg-slate-800/50">
        <Layers className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-semibold text-slate-200">Map Layers</span>
      </div>
      <div className="p-2 space-y-1">
        {layerConfigs.map((layer) => (
          <label key={layer.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-800/50 rounded cursor-pointer">
            <input
              type="checkbox"
              className="w-3.5 h-3.5 rounded border-slate-600 text-emerald-500 bg-slate-950 focus:ring-emerald-500/50 focus:ring-offset-slate-900"
              checked={layers[layer.id] ?? true}
              onChange={(e) => onChange(layer.id, e.target.checked)}
            />
            <span className="text-xs text-slate-300 flex-1">{layer.label}</span>
            <span className={`w-2 h-2 rounded-full ${layer.color}`} />
          </label>
        ))}
      </div>
    </div>
  );
}
