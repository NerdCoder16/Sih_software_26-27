import { useSimulationStore } from '@/stores/simulationStore';
import { useRiskStore } from '@/stores/riskStore';
import { useSensorStore } from '@/stores/sensorStore';
import { useAlertStore } from '@/stores/alertStore';
import { useIncidentStore } from '@/stores/incidentStore';
import { useResourceStore } from '@/stores/resourceStore';
import { useEvacuationStore } from '@/stores/evacuationStore';
import { useAppStore } from '@/stores/appStore';
import { SensorReading, Alert, Incident, SimulationPhase, Shelter } from '@/types';
import { mockZones, mockShelters, mockEvacuationRoutes, mockResources } from '@/services/mockData';

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

  reset() {
    this.lastPhase = '';
    // Restore baseline states for all stores
    useRiskStore.getState().setZones(mockZones);
    useEvacuationStore.getState().setRoutes(mockEvacuationRoutes);
    useEvacuationStore.getState().setShelters(mockShelters);
    useResourceStore.getState().setResources(mockResources);
  }

  private processTick() {
    const simStore = useSimulationStore.getState();
    if (!simStore.state.isActive) return;

    const { phase, elapsedSeconds } = simStore.state;

    // Trigger deterministic world updates on phase change or tick
    if (phase !== this.lastPhase) {
      this.lastPhase = phase;
      this.handlePhaseChange(phase as SimulationPhase, elapsedSeconds);
    }

    this.updateWorldState(phase as SimulationPhase, elapsedSeconds);
  }

  private handlePhaseChange(phase: SimulationPhase, elapsedSeconds: number) {
    const appStore = useAppStore.getState();
    const alertStore = useAlertStore.getState();
    const incidentStore = useIncidentStore.getState();

    appStore.addNotification({
      title: 'Simulation Phase Advanced',
      message: `Phase: ${phase.replace('_', ' ')}`,
      type: 'INFO'
    });

    if (phase === 'SOIL_SATURATION') {
      const alert: Alert = {
        id: `sim-alt-sat-${Date.now()}`,
        title: 'WARNING: High Soil Saturation Detected',
        description: 'Piezometer sensors indicate soil saturation > 88% along Sohra-Cherrapunji slope.',
        severity: 'WARNING',
        status: 'ACTIVE',
        zoneId: 'z1',
        source: 'Geotechnical Sensor Array',
        timestamp: new Date()
      };
      alertStore.addAlert(alert);
    }

    if (phase === 'MULTI_SENSOR_ANOMALY') {
      const alert: Alert = {
        id: `sim-alt-field-${Date.now()}`,
        title: 'Field Observer Verification Received',
        description: 'Tension cracking and 21mm slope offset confirmed by Field Observer Team Ground-01.',
        severity: 'WATCH',
        status: 'ACTIVE',
        zoneId: 'z1',
        source: 'Field Verification Team',
        timestamp: new Date()
      };
      alertStore.addAlert(alert);
    }

    if (phase === 'IMMINENT_LANDSLIDE') {
      const alert: Alert = {
        id: `sim-alt-imm-${Date.now()}`,
        title: 'CRITICAL: Imminent Landslide Warning',
        description: 'Multi-sensor anomaly threshold crossed. Automated evacuation sirens activated.',
        severity: 'CRITICAL',
        status: 'ACTIVE',
        zoneId: 'z1',
        source: 'Automated Early Warning Engine',
        timestamp: new Date()
      };
      alertStore.addAlert(alert);
    }

    if (phase === 'LANDSLIDE_OCCURRED') {
      const incident: Incident = {
        id: `sim-inc-landslide-01`,
        title: 'Major Landslide on NH-40 Highway Corridor',
        description: 'Catastrophic slope failure at Sohra-Cherrapunji sector (91.7333, 25.2667). Main roadway blocked.',
        severity: 'SEVERE',
        status: 'DECLARED',
        zoneId: 'z1',
        coordinates: [91.7333, 25.2667],
        reportedAt: new Date(),
        verifiedAt: new Date(),
        declaredAt: new Date(),
        casualties: 0,
        injuries: 2,
        structuresDamaged: 3,
        populationAffected: 14500,
        roadsAffected: 1,
        priorityScore: 95,
        timeline: [
          {
            id: `evt-1`,
            incidentId: 'sim-inc-landslide-01',
            timestamp: new Date(),
            description: 'Landslide event detected by satellite SAR & seismic array',
            recordedBy: 'System Auto-Detector'
          },
          {
            id: `evt-2`,
            incidentId: 'sim-inc-landslide-01',
            timestamp: new Date(),
            description: 'Incident declared SEVERE by State Emergency Command',
            recordedBy: 'Disaster Duty Officer'
          }
        ]
      };
      incidentStore.addIncident(incident);
    }
  }

  private updateWorldState(phase: SimulationPhase, elapsedSeconds: number) {
    const riskStore = useRiskStore.getState();
    const sensorStore = useSensorStore.getState();
    const evacStore = useEvacuationStore.getState();
    const resourceStore = useResourceStore.getState();

    // 1. Determine Zone Risk Parameters
    let rainVal = 5;
    let satVal = 35;
    let dispVal = 0.2;
    let riskScore = 25;
    let riskLevel: any = 'LOW';

    if (phase === 'HEAVY_RAIN') { rainVal = 65; satVal = 52; dispVal = 1.2; riskScore = 48; riskLevel = 'MODERATE'; }
    else if (phase === 'EXTREME_RAIN') { rainVal = 160; satVal = 74; dispVal = 3.5; riskScore = 64; riskLevel = 'HIGH'; }
    else if (phase === 'SOIL_SATURATION') { rainVal = 195; satVal = 88; dispVal = 6.8; riskScore = 78; riskLevel = 'HIGH'; }
    else if (phase === 'SLOPE_MOVEMENT') { rainVal = 215; satVal = 94; dispVal = 14.2; riskScore = 86; riskLevel = 'HIGH'; }
    else if (phase === 'MULTI_SENSOR_ANOMALY') { rainVal = 230; satVal = 96; dispVal = 21.0; riskScore = 90; riskLevel = 'CRITICAL'; }
    else if (phase === 'IMMINENT_LANDSLIDE') { rainVal = 240; satVal = 98; dispVal = 28.5; riskScore = 96; riskLevel = 'CRITICAL'; }
    else if (phase === 'LANDSLIDE_OCCURRED') { rainVal = 250; satVal = 100; dispVal = 45.0; riskScore = 100; riskLevel = 'CRITICAL'; }
    else if (phase === 'ROAD_BLOCKAGE') { rainVal = 210; satVal = 100; dispVal = 46.5; riskScore = 95; riskLevel = 'CRITICAL'; }
    else if (phase === 'FLASH_FLOOD') { rainVal = 180; satVal = 95; dispVal = 47.0; riskScore = 88; riskLevel = 'CRITICAL'; }
    else if (phase === 'RECOVERY') { rainVal = 20; satVal = 72; dispVal = 47.2; riskScore = 38; riskLevel = 'MODERATE'; }

    // Update risk zone z1
    const currentZones = riskStore.zones.length > 0 ? riskStore.zones : mockZones;
    const updatedZones = currentZones.map((z) => {
      if (z.id === 'z1') {
        return {
          ...z,
          currentRiskLevel: riskLevel,
          riskScore,
          lastUpdated: new Date(),
          factors: [
            { type: 'Rainfall Intensity', value: rainVal, threshold: 100, contribution: Math.min(45, Math.floor(rainVal * 0.2)) },
            { type: 'Soil Saturation', value: satVal, threshold: 85, contribution: Math.min(35, Math.floor(satVal * 0.35)) },
            { type: 'Slope Gradient', value: 42, threshold: 30, contribution: 20 },
            { type: 'Historical Susceptibility', value: 8.5, threshold: 5, contribution: 15 }
          ]
        };
      }
      return z;
    });
    riskStore.setZones(updatedZones);

    // 2. Add Sensor Inclinometer Reading
    const reading: SensorReading = {
      id: `rd-${Date.now()}`,
      sensorId: 's1',
      timestamp: new Date(),
      value: dispVal,
      unit: 'mm',
      isAnomaly: dispVal > 10
    };
    sensorStore.addReading(reading);

    // 3. Evacuation Route & Road Blockage State
    const currentRoutes = evacStore.routes.length > 0 ? evacStore.routes : mockEvacuationRoutes;
    const isBlocked = ['LANDSLIDE_OCCURRED', 'ROAD_BLOCKAGE', 'FLASH_FLOOD'].includes(phase);
    
    const updatedRoutes = currentRoutes.map((r) => {
      if (r.id === 'r1') {
        return {
          ...r,
          isSafe: !isBlocked,
          status: (isBlocked ? 'blocked' : 'active') as any,
          roadCondition: isBlocked ? 'Blocked by Landslide Debris' : 'Passable'
        };
      }
      if (r.id === 'r2') {
        return {
          ...r,
          isSafe: true,
          status: (isBlocked ? 'active' : 'alternative') as any,
          roadCondition: 'Clear Evacuation Bypass'
        };
      }
      return r;
    });
    evacStore.setRoutes(updatedRoutes);
    if (isBlocked && evacStore.selectedRouteId === 'r1') {
      evacStore.selectRoute('r2');
    }

    // 4. Shelter Occupancy Progression
    const currentShelters = evacStore.shelters.length > 0 ? evacStore.shelters : mockShelters;
    let targetOcc = 120;
    if (phase === 'ROAD_BLOCKAGE' || phase === 'LANDSLIDE_OCCURRED') targetOcc = 260;
    if (phase === 'FLASH_FLOOD' || phase === 'RECOVERY') targetOcc = 380;

    const updatedShelters = currentShelters.map((s: Shelter) => {
      if (s.id === 'sh1') {
        return {
          ...s,
          currentOccupancy: targetOcc,
          availableCapacity: s.capacity - targetOcc
        };
      }
      return s;
    });
    evacStore.setShelters(updatedShelters);

    // 5. Emergency Resources Dispatch & Movement
    const currentResources = resourceStore.resources.length > 0 ? resourceStore.resources : mockResources;
    let resStatus: any = 'AVAILABLE';
    let resLoc: [number, number] = [91.8500, 25.5400]; // Base Shillong

    if (['IMMINENT_LANDSLIDE'].includes(phase)) {
      resStatus = 'DISPATCHED';
    } else if (['LANDSLIDE_OCCURRED', 'ROAD_BLOCKAGE'].includes(phase)) {
      resStatus = 'EN_ROUTE';
      // Position moves towards ground zero [91.7333, 25.2667]
      resLoc = [91.7916, 25.4033];
    } else if (['FLASH_FLOOD', 'RECOVERY'].includes(phase)) {
      resStatus = 'ON_SCENE';
      resLoc = [91.7333, 25.2667];
    }

    const updatedResources = currentResources.map((res) => {
      if (res.id === 'res-1' || res.id === 'res-2') {
        return {
          ...res,
          status: resStatus,
          location: resLoc,
          assignedIncidentId: isBlocked ? 'sim-inc-landslide-01' : undefined
        };
      }
      return res;
    });
    resourceStore.setResources(updatedResources);
  }
}

export const simulationEngine = new SimulationEngine();

