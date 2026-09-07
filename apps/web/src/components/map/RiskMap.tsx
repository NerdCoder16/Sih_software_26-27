import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface RiskMapProps {
  center?: [number, number];
  zoom?: number;
}

export function RiskMap({ center = [93.0, 25.5], zoom = 7 }: RiskMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center,
      zoom,
      attributionControl: false
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.ScaleControl({ maxWidth: 80, unit: 'metric' }), 'bottom-left');

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [center, zoom]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
