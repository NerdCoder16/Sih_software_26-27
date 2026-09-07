import { create } from 'zustand';
import { Sensor, SensorReading, SensorStatus } from '@/types';

interface SensorState {
  sensors: Sensor[];
  readings: Map<string, SensorReading[]>;
  setSensors: (sensors: Sensor[]) => void;
  addReading: (reading: SensorReading) => void;
  updateSensorReading: (sensorId: string, value: number, timestamp?: Date | string) => void;
  updateSensorStatus: (id: string, status: SensorStatus) => void;
}

export const useSensorStore = create<SensorState>((set) => ({
  sensors: [],
  readings: new Map(),
  setSensors: (sensors) => set({ sensors }),
  addReading: (reading) => set((state) => {
    const newReadings = new Map(state.readings);
    const existing = newReadings.get(reading.sensorId) || [];
    // Keep last 100 readings
    newReadings.set(reading.sensorId, [...existing, reading].slice(-100));
    return { readings: newReadings };
  }),
  updateSensorReading: (sensorId, value, timestamp) => set((state) => ({
    sensors: state.sensors.map(s => s.id === sensorId ? {
      ...s,
      lastReading: {
        id: `rd-${Date.now()}`,
        sensorId,
        value,
        unit: s.lastReading?.unit || 'val',
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        isAnomaly: false
      }
    } : s)
  })),
  updateSensorStatus: (id, status) => set((state) => ({
    sensors: state.sensors.map(s => s.id === id ? { ...s, status } : s)
  }))
}));
