import { describe, it, expect } from 'vitest';
import { mockZones, mockSensors, mockAlerts, mockIncidents } from '@/services/mockData';

describe('NER EWRS Mock Data Integrity', () => {
  it('should have mock risk zones defined', () => {
    expect(mockZones.length).toBeGreaterThan(0);
    expect(mockZones[0]).toHaveProperty('id');
    expect(mockZones[0]).toHaveProperty('name');
    expect(mockZones[0]).toHaveProperty('currentRiskLevel');
  });

  it('should have mock sensors defined with valid coordinates', () => {
    expect(mockSensors.length).toBeGreaterThan(0);
    expect(mockSensors[0].coordinates.length).toBe(2);
  });

  it('should have active mock alerts', () => {
    expect(mockAlerts.length).toBeGreaterThan(0);
  });

  it('should have mock incidents', () => {
    expect(mockIncidents.length).toBeGreaterThan(0);
  });
});
