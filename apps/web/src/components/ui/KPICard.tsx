import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: 'emerald' | 'amber' | 'red' | 'blue' | 'slate' | 'orange' | 'yellow' | 'green' | 'purple';
}

export function KPICard({ label, value, unit, icon: Icon, trend, trendValue, color = 'slate' }: KPICardProps) {
  const colors: Record<string, string> = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    yellow: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    slate: 'text-slate-400 bg-slate-800/50 border-slate-700/50',
  };

  const iconColors: Record<string, string> = {
    emerald: 'text-emerald-500',
    green: 'text-emerald-500',
    amber: 'text-amber-500',
    yellow: 'text-amber-500',
    orange: 'text-orange-500',
    red: 'text-red-500',
    blue: 'text-blue-500',
    purple: 'text-purple-500',
    slate: 'text-slate-500',
  };

  const activeColor = colors[color] || colors.slate;
  const activeIconColor = iconColors[color] || iconColors.slate;

  return (
    <div className={`rounded-lg border p-3 flex flex-col gap-2 min-w-[140px] ${activeColor}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 truncate">{label}</span>
        <Icon className={`w-4 h-4 ${activeIconColor}`} />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-100">{value}</span>
        {unit && <span className="text-sm font-medium text-slate-500">{unit}</span>}
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-xs">
          {trend === 'up' && <TrendingUp className="w-3 h-3 text-red-400" />}
          {trend === 'down' && <TrendingDown className="w-3 h-3 text-emerald-400" />}
          {trend === 'stable' && <Minus className="w-3 h-3 text-slate-400" />}
          <span className={trend === 'up' ? 'text-red-400' : trend === 'down' ? 'text-emerald-400' : 'text-slate-400'}>
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
}
