import { useState, useEffect } from 'react';
import { DataFreshness } from '@/types';

export function useDataFreshness(timestamp: Date | number | string | null | undefined): DataFreshness {
  const [freshness, setFreshness] = useState<DataFreshness>('UNAVAILABLE');

  useEffect(() => {
    if (!timestamp) {
      setFreshness('UNAVAILABLE');
      return;
    }

    const checkFreshness = () => {
      const ts = new Date(timestamp).getTime();
      const now = Date.now();
      const diffMs = now - ts;
      const diffSeconds = diffMs / 1000;

      if (diffSeconds < 30) {
        setFreshness('LIVE');
      } else if (diffSeconds < 120) {
        setFreshness('RECENT');
      } else if (diffSeconds < 600) {
        setFreshness('STALE');
      } else if (diffSeconds < 1800) {
        setFreshness('DEGRADED');
      } else {
        setFreshness('UNAVAILABLE');
      }
    };

    checkFreshness();
    const intervalId = setInterval(checkFreshness, 10000); // Check every 10s

    return () => clearInterval(intervalId);
  }, [timestamp]);

  return freshness;
}
