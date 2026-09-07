import { Bell, User, Circle } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useEffect, useState } from 'react';

export function Header() {
  const { operatingMode } = useAppStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-12 bg-slate-900 border-b border-slate-700/50 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-slate-200 font-semibold tracking-wide text-sm hidden sm:block">
          NER LANDSLIDE EARLY WARNING & RESPONSE SYSTEM
        </h1>
        
        {operatingMode === 'DEMO' && (
          <div className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-xs font-bold tracking-wider flex items-center gap-1.5">
            <Circle className="w-2 h-2 fill-amber-400 animate-pulse" />
            SIMULATED DATA
          </div>
        )}
        {operatingMode === 'LIVE' && (
          <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-xs font-bold tracking-wider flex items-center gap-1.5">
            <Circle className="w-2 h-2 fill-emerald-400" />
            LIVE
          </div>
        )}
      </div>

      <div className="flex items-center gap-5">
        <div className="text-slate-400 text-xs font-mono hidden md:block">
          {time.toLocaleDateString('en-GB')} {time.toLocaleTimeString('en-GB')}
        </div>

        <div className="flex items-center gap-1.5">
          <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
          <span className="text-slate-400 text-xs">System OK</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-full transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>
          </button>
          <button className="p-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-full transition-colors">
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
