import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Shield,
  AlertTriangle,
  Radio,
  Truck,
  Route,
  Home,
  BarChart3,
  Play,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, operatingMode, toggleMode } = useAppStore();
  const location = useLocation();

  const navItems = [
    { name: 'Command Centre', path: '/command', icon: LayoutDashboard },
    { name: 'Risk Intelligence', path: '/risk', icon: Shield },
    { name: 'Incidents', path: '/incidents', icon: AlertTriangle },
    { name: 'Field Operations', path: '/field', icon: Radio },
    { name: 'Response', path: '/response', icon: Truck },
    { name: 'Evacuation', path: '/evacuation', icon: Route },
    { name: 'Shelters', path: '/shelters', icon: Home },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Simulation', path: '/simulation', icon: Play },
    { name: 'System', path: '/system', icon: Activity },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className={`flex flex-col bg-slate-900 border-r border-slate-700/50 transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-16'}`}>
      <div className="h-12 flex items-center justify-between px-3 border-b border-slate-700/50">
        {sidebarOpen && (
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
            Navigation
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors ml-auto"
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 mx-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              title={!sidebarOpen ? item.name : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Operating Mode Indicator */}
      <div className="p-3 border-t border-slate-700/50">
        <button
          onClick={toggleMode}
          className={`w-full flex items-center justify-between p-2 rounded-lg border text-xs font-medium transition-colors ${
            operatingMode === 'LIVE'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}
          title="Click to toggle Operating Mode"
        >
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${operatingMode === 'LIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            {sidebarOpen && <span>{operatingMode} MODE</span>}
          </div>
          {sidebarOpen && (
            <span className="text-[10px] text-slate-400 hover:underline">Switch</span>
          )}
        </button>
      </div>
    </aside>
  );
}
