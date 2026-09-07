import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[100px] gap-3 text-slate-400">
      <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
