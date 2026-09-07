import { useState } from 'react';
import { useEvacuationStore } from '@/stores/evacuationStore';
import { mockShelters } from '@/services/mockData';
import { Heart, Utensils, Droplets, Zap, Accessibility, Phone, MapPin, Users, ChevronRight } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import type { Shelter } from '@/types';

function getCapacityColor(occupancy: number, capacity: number) {
  const ratio = occupancy / capacity;
  if (ratio > 0.9) return 'bg-red-500';
  if (ratio > 0.7) return 'bg-amber-500';
  if (ratio > 0.4) return 'bg-blue-500';
  return 'bg-emerald-500';
}

function getCapacityBgColor(occupancy: number, capacity: number) {
  const ratio = occupancy / capacity;
  if (ratio > 0.9) return 'bg-red-500/10';
  if (ratio > 0.7) return 'bg-amber-500/10';
  return 'bg-slate-800';
}

const facilityIcons: Record<string, { icon: typeof Heart; label: string }> = {
  'Medical Camp': { icon: Heart, label: 'Medical' },
  'Kitchen': { icon: Utensils, label: 'Food' },
  'Water': { icon: Droplets, label: 'Water' },
  'Electricity': { icon: Zap, label: 'Power' },
  'Generator': { icon: Zap, label: 'Generator' },
  'Toilets': { icon: Accessibility, label: 'Toilets' },
};

export function SheltersPage() {
  const { shelters: storeShelters } = useEvacuationStore();
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);

  const shelters = storeShelters.length > 0 ? storeShelters : mockShelters;
  const totalCapacity = shelters.reduce((s, sh) => s + sh.capacity, 0);
  const totalOccupancy = shelters.reduce((s, sh) => s + sh.currentOccupancy, 0);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-none p-4 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-100">Emergency Shelters</h1>
            <p className="text-xs text-slate-400 mt-0.5">{shelters.length} shelters across NER</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <div className="text-slate-400 text-xs">Total Capacity</div>
              <div className="font-semibold text-slate-100">{totalCapacity.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-slate-400 text-xs">Current Occupancy</div>
              <div className="font-semibold text-amber-400">{totalOccupancy.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-slate-400 text-xs">Available</div>
              <div className="font-semibold text-emerald-400">{(totalCapacity - totalOccupancy).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Shelter Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {shelters.map((shelter) => {
            const available = shelter.capacity - shelter.currentOccupancy;
            const fillPercent = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);

            return (
              <div
                key={shelter.id}
                onClick={() => setSelectedShelter(shelter)}
                className={`rounded-lg border border-slate-700/50 cursor-pointer transition-all hover:border-slate-600 ${getCapacityBgColor(shelter.currentOccupancy, shelter.capacity)}`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-slate-100 truncate">{shelter.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {shelter.district}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 flex-none" />
                  </div>

                  {/* Capacity Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">Occupancy</span>
                      <span className="text-slate-300 font-mono">{shelter.currentOccupancy}/{shelter.capacity}</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${getCapacityColor(shelter.currentOccupancy, shelter.capacity)}`}
                        style={{ width: `${fillPercent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-slate-500">{fillPercent}% filled</span>
                      <span className="text-emerald-400 font-medium">{available} available</span>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div className="flex flex-wrap gap-1.5">
                    {shelter.facilities.map((facility) => {
                      const fi = facilityIcons[facility];
                      if (!fi) return (
                        <span key={facility} className="px-2 py-0.5 bg-slate-700/50 rounded text-xs text-slate-400">{facility}</span>
                      );
                      const Icon = fi.icon;
                      return (
                        <span key={facility} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-700/50 rounded text-xs text-slate-400">
                          <Icon className="w-3 h-3" />
                          {fi.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shelter Detail Drawer */}
      <Drawer isOpen={!!selectedShelter} onClose={() => setSelectedShelter(null)} title={selectedShelter?.name || ''}>
        {selectedShelter && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800 rounded-lg p-3">
                <div className="text-xs text-slate-400">Total Capacity</div>
                <div className="text-xl font-bold text-slate-100">{selectedShelter.capacity}</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-3">
                <div className="text-xs text-slate-400">Current Occupancy</div>
                <div className="text-xl font-bold text-amber-400">{selectedShelter.currentOccupancy}</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-3">
                <div className="text-xs text-slate-400">Available</div>
                <div className="text-xl font-bold text-emerald-400">{selectedShelter.capacity - selectedShelter.currentOccupancy}</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-3">
                <div className="text-xs text-slate-400">District</div>
                <div className="text-sm font-medium text-slate-200 mt-1">{selectedShelter.district}</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">Facilities</h4>
              <div className="space-y-2">
                {selectedShelter.facilities.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-700 pt-3">
              <h4 className="text-sm font-medium text-slate-300 mb-2">Contact</h4>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Users className="w-4 h-4" />
                {selectedShelter.contactPerson}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                <Phone className="w-4 h-4" />
                {selectedShelter.contactPhone}
              </div>
            </div>

            <div className="border-t border-slate-700 pt-3">
              <h4 className="text-sm font-medium text-slate-300 mb-2">Coordinates</h4>
              <div className="text-sm text-slate-400 font-mono">
                {selectedShelter.coordinates[1].toFixed(4)}°N, {selectedShelter.coordinates[0].toFixed(4)}°E
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
