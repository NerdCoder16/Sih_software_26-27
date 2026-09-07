export function StatusBadge({ status, size = 'md', variant = 'default' }: { status: string; size?: 'sm' | 'md'; variant?: 'default' | 'outline' }) {
  let color = 'bg-slate-500 text-slate-100';
  let dotColor = 'bg-slate-400';
  
  const s = status.toUpperCase();
  if (s.includes('SAFE') || s.includes('RESOLVED') || s.includes('OK') || s === 'AVAILABLE') {
    color = 'bg-emerald-500/20 text-emerald-400';
    dotColor = 'bg-emerald-500';
  } else if (s.includes('LOW') || s === 'DISPATCHED') {
    color = 'bg-teal-500/20 text-teal-400';
    dotColor = 'bg-teal-500';
  } else if (s.includes('MODERATE') || s === 'ACTIVE' || s === 'ON_SCENE') {
    color = 'bg-amber-500/20 text-amber-400';
    dotColor = 'bg-amber-500';
  } else if (s.includes('HIGH')) {
    color = 'bg-orange-500/20 text-orange-400';
    dotColor = 'bg-orange-500';
  } else if (s.includes('CRITICAL') || s.includes('SEVERE')) {
    color = 'bg-red-500/20 text-red-400';
    dotColor = 'bg-red-500';
  }

  const px = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs';
  const dotSize = size === 'sm' ? 'w-1 h-1' : 'w-1.5 h-1.5';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded font-medium ${px} ${variant === 'outline' ? 'border border-slate-700 bg-transparent' : color}`}>
      <span className={`rounded-full ${dotColor} ${dotSize}`} />
      {status}
    </span>
  );
}
