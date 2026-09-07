import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface AlertBannerProps {
  severity: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp?: Date | string;
  onDismiss?: () => void;
  onAcknowledge?: () => void;
}

export function AlertBanner({ severity, title, message, onDismiss, onAcknowledge }: AlertBannerProps) {
  const styles = {
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    warning: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    error: 'bg-red-500/10 border-red-500/20 text-red-400',
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  };

  const icons = {
    info: Info,
    warning: AlertCircle,
    error: AlertCircle,
    success: CheckCircle,
  };

  const Icon = icons[severity];

  return (
    <div className={`p-3 rounded-lg border flex gap-3 ${styles[severity]}`}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="text-xs opacity-90 mt-1">{message}</p>
        
        {onAcknowledge && (
          <button 
            onClick={onAcknowledge}
            className="mt-2 text-xs font-medium underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            Acknowledge
          </button>
        )}
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="p-1 hover:bg-white/10 rounded self-start transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
