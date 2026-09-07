import React from 'react';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DataFreshnessIndicatorProps {
  timestamp: string | Date;
  source?: string;
}

export function DataFreshnessIndicator({ timestamp, source }: DataFreshnessIndicatorProps) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

  let color = 'text-slate-400';
  let dotColor = 'bg-slate-500';

  if (diffMinutes < 5) {
    color = 'text-emerald-400';
    dotColor = 'bg-emerald-500';
  } else if (diffMinutes < 30) {
    color = 'text-blue-400';
    dotColor = 'bg-blue-500';
  } else if (diffMinutes < 120) {
    color = 'text-amber-400';
    dotColor = 'bg-amber-500';
  } else {
    color = 'text-red-400';
    dotColor = 'bg-red-500';
  }

  const relativeTime = formatDistanceToNow(date, { addSuffix: true });

  return (
    <div 
      className={`flex items-center gap-1.5 text-xs ${color}`} 
      title={source ? `Source: ${source} | Last updated: ${date.toLocaleString()}` : `Last updated: ${date.toLocaleString()}`}
    >
      <Clock className="w-3.5 h-3.5" />
      <span>{relativeTime}</span>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse ml-1`} />
    </div>
  );
}
