import { useSimulationStore } from '@/stores/simulationStore';
import { useRiskStore } from '@/stores/riskStore';
import { useSensorStore } from '@/stores/sensorStore';
import { useAlertStore } from '@/stores/alertStore';
import { useIncidentStore } from '@/stores/incidentStore';
import { useResourceStore } from '@/stores/resourceStore';
import { useAppStore } from '@/stores/appStore';
import { SensorReading, Alert, Incident } from '@/types';

class SimulationEngine {
  private tickInterval: number | null = null;
  private lastPhase: string = '';

  start() {
    if (this.tickInterval) return;
    this.tickInterval = window.setInterval(() => this.processTick(), 1000);
  }

  stop() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  private processTick() {
    const simState = useSimulationStore.getState().state;
    if (!simState.isActive) return;

    const { phase, elapsedSeconds } = simState;

    // Trigger events on phase change
    if (phase !== this.lastPhase) {
      this.lastPhase = phase;
      this.handlePhaseChange(phase);
    }

    // Generate continuous data based on phase
    this.generateSensorReadings(phase, elapsedSeconds);
  }

  private handlePhaseChange(phase: string) {
    const appStore = useAppStore.getState();
    const alertStore = useAlertStore.getState();
    
    appStore.addNotification({
      title: 'Simulation Phase Changed',
      message: `Entering phase: ${phase}`,
      type: 'INFO'
    });

    if (phase === 'SOIL_SATURATION') {
      const alert: Alert = {
        id: `sim-a-${Date.now()}`,
        title: 'High Soil Saturation Warning',
        description: 'Soil moisture levels exceeding critical thresholds in Sohra-Cherrapunji zone.',
        severity: 'WARNING',
        status: 'ACTIVE',
        zoneId: 'z1',
        source: 'Sensor Network',
        timestamp: new Date()
      };
      alertStore.addAlert(alert);
    }

    if (phase === 'IMMINENT_LANDSLIDE') {
      const alert: Alert = {
        id: `sim-a-${Date.now()}`,
        title: 'CRITICAL: Imminent Slope Failure',
        description: 'Multiple sensors confirm imminent slope failure. Evacuate immediately.',
        severity: 'CRITICAL',
        status: 'ACTIVE',
        zoneId: 'z1',
        source: 'Automated Warning System',
        timestamp: new Date()
      };
      alertStore.addAlert(alert);
    }

    if (phase === 'LANDSLIDE_OCCURRED') {
      const incidentStore = useIncidentStore.getState();
      const incident: Incident = {
        id: `sim-i-${Date.now()}`,
        title: 'Major Landslide at Sohra',
        description: 'Major slope failure has occurred affecting the main road.',
        severity: 'SEVERE',
        status: 'REPORTED',
        zoneId: 'z1',
        coordinates: [91.7333, 25.2667],
        reportedAt: new Date(),
        casualties: 0,
        injuries: 0,
        structuresDamaged: 2
      };
      incidentStore.addIncident(incident);
    }
  }

  private generateSensorReadings(phase: string, time: number) {
    const sensorStore = useSensorStore.getState();
    
    // Simulate inclinometer data
    let baseValue = 0;
    let isAnomaly = false;

    if (phase === 'SLOPE_MOVEMENT' || phase === 'MULTI_SENSOR_ANOMALY' || phase === 'IMMINENT_LANDSLIDE') {
      baseValue = Math.sin(time / 10) * 15 + (time % 10);
      isAnomaly = true;
    } else {
      baseValue = Math.sin(time / 10) * 2;
    }

    const reading: SensorReading = {
      id: `rd-${Date.now()}`,
      sensorId: 's1', // Corresponds to mock sensor
      timestamp: new Date(),
      value: baseValue,
      unit: 'mm',
      isAnomaly
    };

    sensorStore.addReading(reading);
  }
}

export const simulationEngine = new SimulationEngine();
