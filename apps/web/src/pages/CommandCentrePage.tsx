import React from 'react';
import { KPICard } from '@/components/ui/KPICard';
import { Shield, AlertTriangle, Users, CloudRain, Truck } from 'lucide-react';
import { RiskMap } from '@/components/map/RiskMap';
import { MapLayerControl } from '@/components/map/MapLayerControl';
import { MapLegend } from '@/components/map/MapLegend';
import { AlertPanel } from '@/components/alerts/AlertPanel';
import { IncidentList } from '@/components/incidents/IncidentList';
import { useAlertStore } from '@/stores/alertStore';
import { useIncidentStore } from '@/stores/incidentStore';
import { useResourceStore } from '@/stores/resourceStore';
import { useRiskStore } from '@/stores/riskStore';

export function CommandCentrePage() {
  const { alerts } = useAlertStore();
  const { incidents } = useIncidentStore();
  const { resources } = useResourceStore();
  const { zones } = useRiskStore();

  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length || 2;
  const activeIncidentsCount = incidents.filter(i => i.status !== 'CLOSED').length || 3;
  const deployedResourcesCount = resources.filter(r => r.status === 'DISPATCHED' || r.status === 'EN_ROUTE' || r.status === 'ON_SCENE').length || 2;

  const highestRiskZone = zones.find(z => z.currentRiskLevel === 'CRITICAL') 
    ? 'CRITICAL' 
    : (zones.find(z => z.currentRiskLevel === 'HIGH') ? 'HIGH' : 'MODERATE');

  const totalPopAtRisk = zones.reduce((s, z) => s + (z.populationAtRisk || 0), 0) || 45200;

  const kpis = [
    { label: 'Overall Risk Level', value: highestRiskZone, icon: Shield, color: (highestRiskZone === 'CRITICAL' ? 'red' : highestRiskZone === 'HIGH' ? 'orange' : 'amber') as any },
    { label: 'Active Alerts', value: String(activeAlertsCount), icon: AlertTriangle, trend: 'up' as const, trendValue: '+2', color: 'red' as const },
    { label: 'Pop. at Risk', value: `${(totalPopAtRisk / 1000).toFixed(1)}k`, icon: Users, color: 'blue' as const },
    { label: 'Avg Rainfall (24h)', value: '112', unit: 'mm', icon: CloudRain, color: 'blue' as const },
    { label: 'Active Incidents', value: String(activeIncidentsCount), icon: AlertTriangle, color: 'orange' as const },
    { label: 'Deployed Resources', value: String(deployedResourcesCount), icon: Truck, color: 'emerald' as const },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-none p-3 flex gap-3 overflow-x-auto border-b border-slate-800 bg-slate-900/50 hide-scrollbar">
        {kpis.map((kpi, i) => (
          <KPICard key={i} {...kpi} />
        ))}
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        <div className="flex-[2] bg-slate-950 border-r border-slate-800 relative z-0">
          <MapLayerControl layers={{}} onChange={() => {}} />
          <RiskMap />
          <MapLegend />
        </div>
        
        <div className="flex-1 bg-slate-900/50 flex flex-col overflow-hidden max-w-sm xl:max-w-md w-full">
           <div className="flex-1 overflow-hidden border-b border-slate-800">
             <AlertPanel />
           </div>
           <div className="flex-1 overflow-hidden flex flex-col bg-slate-900">
             <div className="p-3 border-b border-slate-800 font-semibold text-sm text-slate-200 sticky top-0 bg-slate-900 z-10">
               Recent Incidents
             </div>
             <div className="flex-1 overflow-y-auto">
                <IncidentList />
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
