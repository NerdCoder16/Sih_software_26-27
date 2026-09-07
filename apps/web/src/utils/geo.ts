import { RiskZone, Coordinates } from '@/types';

export const NER_BOUNDS: [number, number, number, number] = [89.7, 21.9, 97.4, 29.5]; // [minLng, minLat, maxLng, maxLat]
export const DEFAULT_CENTER: Coordinates = [91.88, 25.57]; // Shillong area
export const DEFAULT_ZOOM = 7;

export const createGeoJSON = (zones: RiskZone[]) => {
  return {
    type: 'FeatureCollection',
    features: zones.map(zone => ({
      type: 'Feature',
      id: zone.id,
      properties: {
        id: zone.id,
        name: zone.name,
        riskLevel: zone.currentRiskLevel,
        score: zone.riskScore
      },
      geometry: {
        type: 'Polygon',
        coordinates: [zone.polygon] // GeoJSON polygons expect array of rings
      }
    }))
  };
};

export const getZoneCenter = (zone: RiskZone): Coordinates => {
  return zone.coordinates;
};

export const getBounds = (coordinates: Coordinates[]): [[number, number], [number, number]] => {
  if (!coordinates || coordinates.length === 0) {
    return [[NER_BOUNDS[0], NER_BOUNDS[1]], [NER_BOUNDS[2], NER_BOUNDS[3]]];
  }

  let minLng = coordinates[0][0];
  let maxLng = coordinates[0][0];
  let minLat = coordinates[0][1];
  let maxLat = coordinates[0][1];

  for (let i = 1; i < coordinates.length; i++) {
    const [lng, lat] = coordinates[i];
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }

  return [[minLng, minLat], [maxLng, maxLat]];
};
