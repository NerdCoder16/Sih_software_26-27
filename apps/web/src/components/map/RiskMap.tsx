import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useRiskStore } from '@/stores/riskStore';
import { useSensorStore } from '@/stores/sensorStore';
import { useIncidentStore } from '@/stores/incidentStore';
import { useResourceStore } from '@/stores/resourceStore';
import { useEvacuationStore } from '@/stores/evacuationStore';
import { mockZones, mockSensors, mockIncidents, mockResources, mockShelters, mockEvacuationRoutes } from '@/services/mockData';
import { RiskZone } from '@/types';

interface RiskMapProps {
  center?: [number, number];
  zoom?: number;
  layerVisibility?: Record<string, boolean>;
  onZoneSelect?: (zoneId: string) => void;
}

function getZonePolygonGeoJSON(zone: RiskZone): [number, number][] {
  if (zone.polygon && zone.polygon.length >= 3) {
    const closedPoly = [...zone.polygon];
    const first = closedPoly[0];
    const last = closedPoly[closedPoly.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      closedPoly.push(first);
    }
    return closedPoly;
  }

  const [clon, clat] = zone.coordinates;
  const radius = 0.05;
  const points: [number, number][] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * 2 * Math.PI;
    const dx = radius * Math.cos(angle);
    const dy = radius * Math.sin(angle);
    points.push([clon + dx, clat + dy]);
  }
  points.push(points[0]);
  return points;
}

function getRiskColors(level: string, score: number) {
  const l = (level || '').toUpperCase();
  if (l === 'CRITICAL' || score >= 80) return { fill: '#ef4444', stroke: '#dc2626', fillOpacity: 0.45 };
  if (l === 'HIGH' || score >= 60) return { fill: '#f97316', stroke: '#ea580c', fillOpacity: 0.38 };
  if (l === 'MODERATE' || score >= 40) return { fill: '#f59e0b', stroke: '#d97706', fillOpacity: 0.30 };
  if (l === 'LOW' || score >= 20) return { fill: '#3b82f6', stroke: '#2563eb', fillOpacity: 0.22 };
  return { fill: '#10b981', stroke: '#059669', fillOpacity: 0.18 };
}

export function RiskMap({ center = [92.5, 25.5], zoom = 7, layerVisibility, onZoneSelect }: RiskMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const activePopup = useRef<maplibregl.Popup | null>(null);

  const { zones: storeZones } = useRiskStore();
  const { sensors: storeSensors } = useSensorStore();
  const { incidents: storeIncidents } = useIncidentStore();
  const { resources: storeResources } = useResourceStore();
  const { shelters: storeShelters, routes: storeRoutes, selectedRouteId } = useEvacuationStore();

  const zones = storeZones.length > 0 ? storeZones : mockZones;
  const sensors = storeSensors.length > 0 ? storeSensors : mockSensors;
  const incidents = storeIncidents.length > 0 ? storeIncidents : mockIncidents;
  const resources = storeResources.length > 0 ? storeResources : mockResources;
  const shelters = storeShelters.length > 0 ? storeShelters : mockShelters;
  const routes = storeRoutes.length > 0 ? storeRoutes : mockEvacuationRoutes;

  // 1. Initialize MapLibre GL Map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center,
      zoom,
      attributionControl: false,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-left');

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // 2. Add Sources & Layers on Map Load & Store Changes
  useEffect(() => {
    if (!map.current) return;

    const m = map.current;

    const setupLayers = () => {
      // A. Risk Zones Source & Layers
      const zonesGeoJSON: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: zones.map((z) => {
          const poly = getZonePolygonGeoJSON(z);
          const colors = getRiskColors(z.currentRiskLevel, z.riskScore);
          return {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [poly],
            },
            properties: {
              id: z.id,
              name: z.name,
              district: z.district,
              currentRiskLevel: z.currentRiskLevel,
              riskScore: z.riskScore,
              populationAtRisk: z.populationAtRisk || 0,
              fillColor: colors.fill,
              strokeColor: colors.stroke,
              fillOpacity: colors.fillOpacity,
            },
          };
        }),
      };

      if (m.getSource('risk-zones-source')) {
        (m.getSource('risk-zones-source') as maplibregl.GeoJSONSource).setData(zonesGeoJSON);
      } else {
        m.addSource('risk-zones-source', { type: 'geojson', data: zonesGeoJSON });

        m.addLayer({
          id: 'risk-zones-fill',
          type: 'fill',
          source: 'risk-zones-source',
          paint: {
            'fill-color': ['get', 'fillColor'],
            'fill-opacity': ['get', 'fillOpacity'],
          },
        });

        m.addLayer({
          id: 'risk-zones-line',
          type: 'line',
          source: 'risk-zones-source',
          paint: {
            'line-color': ['get', 'strokeColor'],
            'line-width': 2.5,
            'line-opacity': 0.85,
          },
        });

        m.addLayer({
          id: 'risk-zones-label',
          type: 'symbol',
          source: 'risk-zones-source',
          layout: {
            'text-field': ['concat', ['get', 'name'], '\n', ['get', 'currentRiskLevel'], ' (', ['get', 'riskScore'], ')'],
            'text-size': 11,
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-anchor': 'center',
          },
          paint: {
            'text-color': '#ffffff',
            'text-halo-color': '#0f172a',
            'text-halo-width': 2,
          },
        });
      }

      // B. Evacuation Routes Source & Layers
      const routesGeoJSON: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: routes.map((r) => {
          const isSelected = r.id === selectedRouteId;
          const originZone = zones.find((z) => z.id === r.originZoneId);
          const destShelter = shelters.find((s) => s.id === r.destinationShelterId);
          const path = r.path && r.path.length >= 2 ? r.path : [originZone?.coordinates || [91.73, 25.26], destShelter?.coordinates || [91.75, 25.35]];

          return {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: path,
            },
            properties: {
              id: r.id,
              name: r.name,
              isSelected,
              isSafe: r.isSafe !== false,
              lineColor: isSelected ? '#38bdf8' : r.isSafe !== false ? '#a855f7' : '#ef4444',
              lineWidth: isSelected ? 8 : 4,
              haloColor: isSelected ? '#0284c7' : '#7e22ce',
              haloWidth: isSelected ? 16 : 8,
              haloOpacity: isSelected ? 0.7 : 0.25,
            },
          };
        }),
      };

      if (m.getSource('evacuation-routes-source')) {
        (m.getSource('evacuation-routes-source') as maplibregl.GeoJSONSource).setData(routesGeoJSON);
      } else {
        m.addSource('evacuation-routes-source', { type: 'geojson', data: routesGeoJSON });

        m.addLayer({
          id: 'evacuation-routes-halo',
          type: 'line',
          source: 'evacuation-routes-source',
          paint: {
            'line-color': ['get', 'haloColor'],
            'line-width': ['get', 'haloWidth'],
            'line-opacity': ['get', 'haloOpacity'],
            'line-blur': 3,
          },
        });

        m.addLayer({
          id: 'evacuation-routes-line',
          type: 'line',
          source: 'evacuation-routes-source',
          paint: {
            'line-color': ['get', 'lineColor'],
            'line-width': ['get', 'lineWidth'],
            'line-opacity': 0.95,
          },
        });
      }

      // C. Shelters Source & Layer
      const sheltersGeoJSON: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: shelters.map((s) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: s.coordinates },
          properties: {
            id: s.id,
            name: s.name,
            district: s.district,
            capacity: s.capacity,
            occupancy: s.currentOccupancy,
            isAssociated: routes.some((r) => r.id === selectedRouteId && r.destinationShelterId === s.id),
          },
        })),
      };

      if (m.getSource('shelters-source')) {
        (m.getSource('shelters-source') as maplibregl.GeoJSONSource).setData(sheltersGeoJSON);
      } else {
        m.addSource('shelters-source', { type: 'geojson', data: sheltersGeoJSON });

        m.addLayer({
          id: 'shelters-circle',
          type: 'circle',
          source: 'shelters-source',
          paint: {
            'circle-radius': ['case', ['get', 'isAssociated'], 9, 6],
            'circle-color': ['case', ['get', 'isAssociated'], '#38bdf8', '#10b981'],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
          },
        });

        m.addLayer({
          id: 'shelters-label',
          type: 'symbol',
          source: 'shelters-source',
          layout: {
            'text-field': '{name}',
            'text-size': 10,
            'text-offset': [0, 1.2],
            'text-anchor': 'top',
          },
          paint: {
            'text-color': '#34d399',
            'text-halo-color': '#0f172a',
            'text-halo-width': 2,
          },
        });
      }

      // D. Sensors Source & Layer
      const sensorsGeoJSON: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: sensors.map((s) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: s.coordinates },
          properties: {
            id: s.id,
            name: s.name,
            type: s.type,
            status: s.status,
            readingVal: s.lastReading?.value !== undefined ? `${s.lastReading.value} ${s.lastReading.unit}` : 'N/A',
          },
        })),
      };

      if (m.getSource('sensors-source')) {
        (m.getSource('sensors-source') as maplibregl.GeoJSONSource).setData(sensorsGeoJSON);
      } else {
        m.addSource('sensors-source', { type: 'geojson', data: sensorsGeoJSON });

        m.addLayer({
          id: 'sensors-circle',
          type: 'circle',
          source: 'sensors-source',
          paint: {
            'circle-radius': 5,
            'circle-color': '#3b82f6',
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#93c5fd',
          },
        });
      }

      // E. Incidents Source & Layer
      const incidentsGeoJSON: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: incidents.map((i) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: i.coordinates },
          properties: {
            id: i.id,
            title: i.title,
            severity: i.severity,
            status: i.status,
          },
        })),
      };

      if (m.getSource('incidents-source')) {
        (m.getSource('incidents-source') as maplibregl.GeoJSONSource).setData(incidentsGeoJSON);
      } else {
        m.addSource('incidents-source', { type: 'geojson', data: incidentsGeoJSON });

        m.addLayer({
          id: 'incidents-circle',
          type: 'circle',
          source: 'incidents-source',
          paint: {
            'circle-radius': 7,
            'circle-color': '#f97316',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
          },
        });
      }

      // F. Resources Source & Layer
      const resourcesGeoJSON: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: resources.map((r) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: r.location },
          properties: {
            id: r.id,
            name: r.name,
            status: r.status,
            type: r.type,
          },
        })),
      };

      if (m.getSource('resources-source')) {
        (m.getSource('resources-source') as maplibregl.GeoJSONSource).setData(resourcesGeoJSON);
      } else {
        m.addSource('resources-source', { type: 'geojson', data: resourcesGeoJSON });

        m.addLayer({
          id: 'resources-circle',
          type: 'circle',
          source: 'resources-source',
          paint: {
            'circle-radius': 6,
            'circle-color': '#14b8a6',
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#99f6e4',
          },
        });
      }

      // G. Rainfall Overlay Heatmap Layer
      const rainfallGeoJSON: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: zones.map((z) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: z.coordinates },
          properties: {
            intensity: z.riskScore,
          },
        })),
      };

      if (m.getSource('rainfall-source')) {
        (m.getSource('rainfall-source') as maplibregl.GeoJSONSource).setData(rainfallGeoJSON);
      } else {
        m.addSource('rainfall-source', { type: 'geojson', data: rainfallGeoJSON });

        m.addLayer({
          id: 'rainfall-heatmap',
          type: 'heatmap',
          source: 'rainfall-source',
          paint: {
            'heatmap-weight': ['interpolate', ['linear'], ['get', 'intensity'], 0, 0, 100, 1],
            'heatmap-intensity': 1,
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(0, 0, 255, 0)',
              0.2, 'rgba(6, 182, 212, 0.4)',
              0.5, 'rgba(59, 130, 246, 0.6)',
              0.8, 'rgba(99, 102, 241, 0.8)',
            ],
            'heatmap-radius': 45,
            'heatmap-opacity': 0.6,
          },
        });
      }
    };

    if (m.isStyleLoaded()) {
      setupLayers();
    } else {
      m.once('load', setupLayers);
    }
  }, [zones, sensors, incidents, resources, shelters, routes, selectedRouteId]);

  // 3. Interactive Click Popups
  useEffect(() => {
    if (!map.current) return;
    const m = map.current;

    const removePopup = () => {
      if (activePopup.current) {
        activePopup.current.remove();
        activePopup.current = null;
      }
    };

    const handleZoneClick = (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
      if (!e.features || !e.features.length) return;
      const props = e.features[0].properties;
      if (!props) return;

      if (onZoneSelect) onZoneSelect(props.id);
      removePopup();

      const targetZone = zones.find(z => z.id === props.id);
      const factorsHtml = targetZone?.factors ? targetZone.factors.map(f => `
        <div style="display:flex; justify-content:space-between; font-size:11px; margin-top:2px; color:#cbd5e1;">
          <span>${f.type}:</span>
          <strong style="color:#e2e8f0;">${f.value} (Contrib: +${f.contribution})</strong>
        </div>
      `).join('') : '';

      activePopup.current = new maplibregl.Popup({ className: 'custom-map-popup' })
        .setLngLat(e.lngLat)
        .setHTML(`
          <div style="background: #0f172a; color: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #334155; font-family: sans-serif; min-width: 220px;">
            <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #94a3b8;">${props.district || 'NER Region'}</div>
            <div style="font-size: 14px; font-weight: bold; margin-bottom: 6px; color: #ffffff;">${props.name}</div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
              <span>Risk Level:</span>
              <strong style="color: ${props.fillColor}">${props.currentRiskLevel}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
              <span>Risk Score:</span>
              <strong style="color: #38bdf8">${props.riskScore} / 100</strong>
            </div>
            <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 6px;">Pop. at Risk: ${(Number(props.populationAtRisk) || 0).toLocaleString()}</div>
            ${factorsHtml ? `<div style="border-top:1px solid #1e293b; pt:4px; margin-top:4px;"><div style="font-size:10px; font-weight:bold; color:#a855f7;">AI Factor Breakdown:</div>${factorsHtml}</div>` : ''}
          </div>
        `)
        .addTo(m);
    };

    const handleIncidentClick = (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
      if (!e.features || !e.features.length) return;
      const props = e.features[0].properties;
      if (!props) return;
      removePopup();

      activePopup.current = new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`
          <div style="background: #0f172a; color: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #ef4444; font-family: sans-serif; min-width: 200px;">
            <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #ef4444;">Active Incident</div>
            <div style="font-size: 13px; font-weight: bold; margin-bottom: 4px; color: #ffffff;">${props.title}</div>
            <div style="font-size: 11px; color: #cbd5e1;">Severity: <strong style="color:#f97316;">${props.severity}</strong></div>
            <div style="font-size: 11px; color: #cbd5e1;">Status: <strong style="color:#22c55e;">${props.status}</strong></div>
          </div>
        `)
        .addTo(m);
    };

    const handleShelterClick = (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
      if (!e.features || !e.features.length) return;
      const props = e.features[0].properties;
      if (!props) return;
      removePopup();

      activePopup.current = new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`
          <div style="background: #0f172a; color: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #10b981; font-family: sans-serif; min-width: 200px;">
            <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #10b981;">Evacuation Shelter</div>
            <div style="font-size: 13px; font-weight: bold; margin-bottom: 4px; color: #ffffff;">${props.name}</div>
            <div style="font-size: 11px; color: #cbd5e1;">Occupancy: <strong>${props.occupancy} / ${props.capacity}</strong></div>
            <div style="font-size: 11px; color: #cbd5e1;">Available Space: <strong style="color:#38bdf8;">${props.capacity - props.occupancy} citizens</strong></div>
          </div>
        `)
        .addTo(m);
    };

    m.on('click', 'risk-zones-fill', handleZoneClick);
    m.on('click', 'incidents-circle', handleIncidentClick);
    m.on('click', 'shelters-circle', handleShelterClick);

    return () => {
      m.off('click', 'risk-zones-fill', handleZoneClick);
      m.off('click', 'incidents-circle', handleIncidentClick);
      m.off('click', 'shelters-circle', handleShelterClick);
    };
  }, [zones, incidents, shelters, onZoneSelect]);

  // 4. Update Layer Visibilities from layerVisibility Prop
  useEffect(() => {
    if (!map.current || !layerVisibility) return;
    const m = map.current;

    const applyVisibility = (layerIds: string[], isVisible: boolean) => {
      layerIds.forEach((id) => {
        if (m.getLayer(id)) {
          m.setLayoutProperty(id, 'visibility', isVisible ? 'visible' : 'none');
        }
      });
    };

    applyVisibility(['risk-zones-fill', 'risk-zones-line', 'risk-zones-label'], layerVisibility['risk-zones'] ?? true);
    applyVisibility(['sensors-circle'], layerVisibility['sensors'] ?? true);
    applyVisibility(['incidents-circle'], layerVisibility['incidents'] ?? true);
    applyVisibility(['resources-circle'], layerVisibility['resources'] ?? true);
    applyVisibility(['shelters-circle', 'shelters-label'], layerVisibility['shelters'] ?? true);
    applyVisibility(['evacuation-routes-halo', 'evacuation-routes-line'], layerVisibility['evacuation-routes'] ?? true);
    applyVisibility(['rainfall-heatmap'], layerVisibility['rainfall'] ?? true);
  }, [layerVisibility]);

  // 5. PRIORITY 1: Zoom & Focus on Selected Evacuation Route
  useEffect(() => {
    if (!map.current || !selectedRouteId) return;
    const m = map.current;

    const route = routes.find((r) => r.id === selectedRouteId);
    if (!route) return;

    const originZone = zones.find((z) => z.id === route.originZoneId);
    const destShelter = shelters.find((s) => s.id === route.destinationShelterId);
    const path = route.path && route.path.length >= 2 ? route.path : [originZone?.coordinates || [91.73, 25.26], destShelter?.coordinates || [91.75, 25.35]];

    // Calculate bounds of route path
    let minLon = 180, maxLon = -180, minLat = 90, maxLat = -90;
    path.forEach(([lon, lat]) => {
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    });

    // Fit bounds or fly to route center
    if (minLon < maxLon && minLat < maxLat) {
      m.fitBounds([[minLon, minLat], [maxLon, maxLat]], {
        padding: 90,
        maxZoom: 13,
        duration: 1500,
      });
    } else {
      const centerLon = (minLon + maxLon) / 2;
      const centerLat = (minLat + maxLat) / 2;
      m.flyTo({
        center: [centerLon, centerLat],
        zoom: 11.5,
        duration: 1500,
      });
    }
  }, [selectedRouteId, routes, zones, shelters]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
