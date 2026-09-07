import { formatDistanceToNow } from 'date-fns';
import { RiskLevel, AlertSeverity, IncidentStatus, ResourceStatus } from '@/types';

export const formatRiskLevel = (level: RiskLevel): string => {
  return level.charAt(0) + level.slice(1).toLowerCase();
};

export const formatTimestamp = (date: Date | string | number): string => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatCoordinates = (lng: number, lat: number): string => {
  const latStr = lat >= 0 ? `${lat.toFixed(4)}°N` : `${Math.abs(lat).toFixed(4)}°S`;
  const lngStr = lng >= 0 ? `${lng.toFixed(4)}°E` : `${Math.abs(lng).toFixed(4)}°W`;
  return `${latStr}, ${lngStr}`;
};

export const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
};

export const formatPopulation = (count: number): string => {
  return new Intl.NumberFormat().format(count);
};

export const formatDuration = (ms: number): string => {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const getRiskColor = (level: RiskLevel): string => {
  switch (level) {
    case 'LOW': return '#10B981'; // green-500
    case 'MODERATE': return '#F59E0B'; // amber-500
    case 'HIGH': return '#EF4444'; // red-500
    case 'CRITICAL': return '#7F1D1D'; // red-900
    default: return '#6B7280';
  }
};

export const getAlertColor = (severity: AlertSeverity): string => {
  switch (severity) {
    case 'INFO': return '#3B82F6'; // blue-500
    case 'WATCH': return '#F59E0B'; // amber-500
    case 'WARNING': return '#EF4444'; // red-500
    case 'CRITICAL': return '#991B1B'; // red-800
    default: return '#6B7280';
  }
};

export const getStatusColor = (status: IncidentStatus | ResourceStatus | string): string => {
  switch (status) {
    case 'REPORTED':
    case 'AVAILABLE': return '#10B981';
    case 'VERIFIED':
    case 'DISPATCHED': return '#3B82F6';
    case 'RESPONDING':
    case 'ON_SCENE': return '#F59E0B';
    case 'RECOVERY': return '#8B5CF6';
    case 'CLOSED':
    case 'OUT_OF_SERVICE': return '#6B7280';
    default: return '#6B7280';
  }
};
