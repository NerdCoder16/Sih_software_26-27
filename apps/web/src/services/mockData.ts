import type { RiskZone, Sensor, Alert, Incident, Resource, Shelter, EvacuationRoute, ServiceHealth, FieldReport, SensorReading, IncidentEvent } from '@/types';

const now = new Date();
const hour = (h: number) => new Date(now.getTime() - h * 3600000);
const min = (m: number) => new Date(now.getTime() - m * 60000);

// ============================================================
// RISK ZONES — 12 zones across NE India
// ============================================================
export const mockZones: RiskZone[] = [
  {
    id: 'z1',
    name: 'Sohra-Cherrapunji Slope Zone',
    district: 'East Khasi Hills',
    coordinates: [91.7333, 25.2667],
    polygon: [[91.70, 25.23], [91.77, 25.23], [91.77, 25.30], [91.70, 25.30], [91.70, 25.23]],
    currentRiskLevel: 'CRITICAL',
    riskScore: 89,
    factors: [
      { type: 'Rainfall Intensity', value: 185, threshold: 100, contribution: 35 },
      { type: 'Soil Saturation', value: 92, threshold: 85, contribution: 30 },
      { type: 'Slope Gradient', value: 42, threshold: 30, contribution: 20 },
      { type: 'Historical Susceptibility', value: 8.5, threshold: 5, contribution: 15 },
    ],
    populationAtRisk: 14500,
    lastUpdated: min(2),
  },
  {
    id: 'z2',
    name: 'NH-40 Highway Corridor',
    district: 'Ri-Bhoi',
    coordinates: [91.8667, 25.9000],
    polygon: [[91.82, 25.85], [91.92, 25.85], [91.92, 25.95], [91.82, 25.95], [91.82, 25.85]],
    currentRiskLevel: 'HIGH',
    riskScore: 76,
    factors: [
      { type: 'Rainfall Intensity', value: 142, threshold: 100, contribution: 40 },
      { type: 'Geological Weakness', value: 7.2, threshold: 5, contribution: 30 },
      { type: 'Vegetation Loss', value: 28, threshold: 20, contribution: 20 },
      { type: 'Road Cut Instability', value: 6.0, threshold: 4, contribution: 10 },
    ],
    populationAtRisk: 22000,
    lastUpdated: min(5),
  },
  {
    id: 'z3',
    name: 'Mawsynram Ridge',
    district: 'East Khasi Hills',
    coordinates: [91.5833, 25.3000],
    polygon: [[91.55, 25.27], [91.62, 25.27], [91.62, 25.33], [91.55, 25.33], [91.55, 25.27]],
    currentRiskLevel: 'HIGH',
    riskScore: 72,
    factors: [
      { type: 'Extreme Rainfall', value: 210, threshold: 150, contribution: 45 },
      { type: 'Slope Movement', value: 3.2, threshold: 2.0, contribution: 35 },
      { type: 'Soil Depth', value: 1.8, threshold: 2.5, contribution: 20 },
    ],
    populationAtRisk: 8200,
    lastUpdated: min(8),
  },
  {
    id: 'z4',
    name: 'Dawki Border Road',
    district: 'West Jaintia Hills',
    coordinates: [92.0230, 25.1860],
    polygon: [[91.99, 25.16], [92.06, 25.16], [92.06, 25.21], [91.99, 25.21], [91.99, 25.16]],
    currentRiskLevel: 'MODERATE',
    riskScore: 55,
    factors: [
      { type: 'Rainfall', value: 95, threshold: 100, contribution: 35 },
      { type: 'River Erosion', value: 6.5, threshold: 5, contribution: 40 },
      { type: 'Road Condition', value: 4.0, threshold: 3, contribution: 25 },
    ],
    populationAtRisk: 5600,
    lastUpdated: min(12),
  },
  {
    id: 'z5',
    name: 'Shillong Peak Escarpment',
    district: 'East Khasi Hills',
    coordinates: [91.8500, 25.5400],
    polygon: [[91.82, 25.51], [91.88, 25.51], [91.88, 25.57], [91.82, 25.57], [91.82, 25.51]],
    currentRiskLevel: 'MODERATE',
    riskScore: 48,
    factors: [
      { type: 'Urban Runoff', value: 65, threshold: 50, contribution: 40 },
      { type: 'Slope Gradient', value: 28, threshold: 30, contribution: 30 },
      { type: 'Deforestation', value: 35, threshold: 25, contribution: 30 },
    ],
    populationAtRisk: 32000,
    lastUpdated: min(3),
  },
  {
    id: 'z6',
    name: 'Jowai-Pynursla Road',
    district: 'West Jaintia Hills',
    coordinates: [92.2050, 25.4500],
    polygon: [[92.17, 25.42], [92.24, 25.42], [92.24, 25.48], [92.17, 25.48], [92.17, 25.42]],
    currentRiskLevel: 'LOW',
    riskScore: 32,
    factors: [
      { type: 'Rainfall', value: 60, threshold: 100, contribution: 40 },
      { type: 'Slope Stability', value: 2.0, threshold: 5, contribution: 30 },
      { type: 'Vegetation Cover', value: 75, threshold: 60, contribution: 30 },
    ],
    populationAtRisk: 4200,
    lastUpdated: min(15),
  },
  {
    id: 'z7',
    name: 'Kohima Bypass Zone',
    district: 'Kohima',
    coordinates: [94.1100, 25.6700],
    polygon: [[94.08, 25.64], [94.14, 25.64], [94.14, 25.70], [94.08, 25.70], [94.08, 25.64]],
    currentRiskLevel: 'MODERATE',
    riskScore: 52,
    factors: [
      { type: 'Rainfall', value: 88, threshold: 100, contribution: 35 },
      { type: 'Construction Activity', value: 7.0, threshold: 5, contribution: 35 },
      { type: 'Drainage Failure', value: 4.5, threshold: 3, contribution: 30 },
    ],
    populationAtRisk: 18500,
    lastUpdated: min(7),
  },
  {
    id: 'z8',
    name: 'Aizawl Ridge Sector',
    district: 'Aizawl',
    coordinates: [92.7176, 23.7271],
    polygon: [[92.69, 23.70], [92.75, 23.70], [92.75, 23.76], [92.69, 23.76], [92.69, 23.70]],
    currentRiskLevel: 'HIGH',
    riskScore: 68,
    factors: [
      { type: 'Rainfall', value: 130, threshold: 100, contribution: 35 },
      { type: 'Urban Slope Loading', value: 8.0, threshold: 5, contribution: 35 },
      { type: 'Drainage', value: 5.5, threshold: 4, contribution: 30 },
    ],
    populationAtRisk: 45000,
    lastUpdated: min(4),
  },
  {
    id: 'z9',
    name: 'Imphal Valley Fringe',
    district: 'Imphal East',
    coordinates: [93.9368, 24.8170],
    polygon: [[93.90, 24.79], [93.97, 24.79], [93.97, 24.85], [93.90, 24.85], [93.90, 24.79]],
    currentRiskLevel: 'LOW',
    riskScore: 28,
    factors: [
      { type: 'Rainfall', value: 55, threshold: 100, contribution: 50 },
      { type: 'Terrain', value: 15, threshold: 30, contribution: 30 },
      { type: 'Soil Condition', value: 2.0, threshold: 5, contribution: 20 },
    ],
    populationAtRisk: 12000,
    lastUpdated: min(20),
  },
  {
    id: 'z10',
    name: 'Itanagar Hill Zone',
    district: 'Papumpare',
    coordinates: [93.6200, 27.0844],
    polygon: [[93.59, 27.06], [93.65, 27.06], [93.65, 27.11], [93.59, 27.11], [93.59, 27.06]],
    currentRiskLevel: 'MODERATE',
    riskScore: 45,
    factors: [
      { type: 'Rainfall', value: 78, threshold: 100, contribution: 40 },
      { type: 'Deforestation', value: 40, threshold: 30, contribution: 35 },
      { type: 'Soil Erosion', value: 5.5, threshold: 5, contribution: 25 },
    ],
    populationAtRisk: 28000,
    lastUpdated: min(10),
  },
  {
    id: 'z11',
    name: 'Nongstoin Highway Corridor',
    district: 'West Khasi Hills',
    coordinates: [91.2650, 25.5200],
    polygon: [[91.23, 25.49], [91.30, 25.49], [91.30, 25.55], [91.23, 25.55], [91.23, 25.49]],
    currentRiskLevel: 'MODERATE',
    riskScore: 58,
    factors: [
      { type: 'Rainfall', value: 105, threshold: 100, contribution: 35 },
      { type: 'Road Cut', value: 5.5, threshold: 4, contribution: 35 },
      { type: 'Geology', value: 6.0, threshold: 5, contribution: 30 },
    ],
    populationAtRisk: 9800,
    lastUpdated: min(6),
  },
  {
    id: 'z12',
    name: 'Umiam Lake Slopes',
    district: 'Ri-Bhoi',
    coordinates: [91.8800, 25.6700],
    polygon: [[91.85, 25.64], [91.91, 25.64], [91.91, 25.70], [91.85, 25.70], [91.85, 25.64]],
    currentRiskLevel: 'LOW',
    riskScore: 22,
    factors: [
      { type: 'Rainfall', value: 45, threshold: 100, contribution: 40 },
      { type: 'Vegetation', value: 82, threshold: 60, contribution: 30 },
      { type: 'Slope', value: 18, threshold: 30, contribution: 30 },
    ],
    populationAtRisk: 3400,
    lastUpdated: min(25),
  },
];

// ============================================================
// SENSORS — 20 sensors across zones
// ============================================================
export const mockSensors: Sensor[] = [
  { id: 's01', zoneId: 'z1', type: 'RAIN_GAUGE', name: 'Cherrapunji AWS', coordinates: [91.7330, 25.2660], status: 'ACTIVE', installationDate: new Date('2022-11-10'), batteryLevel: 92 },
  { id: 's02', zoneId: 'z1', type: 'INCLINOMETER', name: 'Sohra Slope Inclinometer A', coordinates: [91.7340, 25.2670], status: 'ACTIVE', installationDate: new Date('2023-01-15'), batteryLevel: 85 },
  { id: 's03', zoneId: 'z1', type: 'PIEZOMETER', name: 'Sohra Piezometer 1', coordinates: [91.7320, 25.2650], status: 'ACTIVE', installationDate: new Date('2023-03-20'), batteryLevel: 78 },
  { id: 's04', zoneId: 'z2', type: 'RAIN_GAUGE', name: 'Nongpoh AWS', coordinates: [91.8650, 25.8980], status: 'ACTIVE', installationDate: new Date('2022-09-05'), batteryLevel: 88 },
  { id: 's05', zoneId: 'z2', type: 'INCLINOMETER', name: 'NH-40 Km 42 Inclinometer', coordinates: [91.8700, 25.9050], status: 'ACTIVE', installationDate: new Date('2023-06-12'), batteryLevel: 90 },
  { id: 's06', zoneId: 'z2', type: 'EXTENSOMETER', name: 'NH-40 Crack Monitor', coordinates: [91.8680, 25.9020], status: 'MAINTENANCE', installationDate: new Date('2023-02-28'), batteryLevel: 45 },
  { id: 's07', zoneId: 'z3', type: 'RAIN_GAUGE', name: 'Mawsynram AWS', coordinates: [91.5830, 25.2990], status: 'ACTIVE', installationDate: new Date('2022-07-18'), batteryLevel: 95 },
  { id: 's08', zoneId: 'z3', type: 'TILT_METER', name: 'Mawsynram Tilt Sensor', coordinates: [91.5850, 25.3010], status: 'ACTIVE', installationDate: new Date('2023-04-10'), batteryLevel: 82 },
  { id: 's09', zoneId: 'z4', type: 'RAIN_GAUGE', name: 'Dawki AWS', coordinates: [92.0240, 25.1870], status: 'ACTIVE', installationDate: new Date('2023-01-22'), batteryLevel: 87 },
  { id: 's10', zoneId: 'z5', type: 'INCLINOMETER', name: 'Shillong Peak Monitor', coordinates: [91.8510, 25.5410], status: 'ACTIVE', installationDate: new Date('2022-12-01'), batteryLevel: 91 },
  { id: 's11', zoneId: 'z5', type: 'RAIN_GAUGE', name: 'Shillong AWS', coordinates: [91.8490, 25.5390], status: 'ACTIVE', installationDate: new Date('2022-06-15'), batteryLevel: 94 },
  { id: 's12', zoneId: 'z7', type: 'INCLINOMETER', name: 'Kohima Bypass Monitor', coordinates: [94.1110, 25.6710], status: 'ACTIVE', installationDate: new Date('2023-05-08'), batteryLevel: 79 },
  { id: 's13', zoneId: 'z7', type: 'RAIN_GAUGE', name: 'Kohima AWS', coordinates: [94.1090, 25.6690], status: 'ACTIVE', installationDate: new Date('2022-08-20'), batteryLevel: 86 },
  { id: 's14', zoneId: 'z8', type: 'INCLINOMETER', name: 'Aizawl Ridge Monitor A', coordinates: [92.7180, 23.7280], status: 'ACTIVE', installationDate: new Date('2023-07-14'), batteryLevel: 83 },
  { id: 's15', zoneId: 'z8', type: 'RAIN_GAUGE', name: 'Aizawl AWS', coordinates: [92.7170, 23.7260], status: 'OFFLINE', installationDate: new Date('2022-10-30'), batteryLevel: 12 },
  { id: 's16', zoneId: 'z10', type: 'RAIN_GAUGE', name: 'Itanagar AWS', coordinates: [93.6210, 27.0850], status: 'ACTIVE', installationDate: new Date('2023-02-10'), batteryLevel: 89 },
  { id: 's17', zoneId: 'z10', type: 'INCLINOMETER', name: 'Itanagar Hill Monitor', coordinates: [93.6190, 27.0840], status: 'ACTIVE', installationDate: new Date('2023-08-22'), batteryLevel: 77 },
  { id: 's18', zoneId: 'z11', type: 'RAIN_GAUGE', name: 'Nongstoin AWS', coordinates: [91.2660, 25.5210], status: 'ACTIVE', installationDate: new Date('2022-11-25'), batteryLevel: 93 },
  { id: 's19', zoneId: 'z11', type: 'PIEZOMETER', name: 'Nongstoin Piezometer', coordinates: [91.2640, 25.5190], status: 'ACTIVE', installationDate: new Date('2023-09-05'), batteryLevel: 81 },
  { id: 's20', zoneId: 'z12', type: 'RAIN_GAUGE', name: 'Umiam AWS', coordinates: [91.8810, 25.6710], status: 'ACTIVE', installationDate: new Date('2023-03-15'), batteryLevel: 96 },
];

// ============================================================
// ALERTS — 8 alerts at various severities
// ============================================================
export const mockAlerts: Alert[] = [
  {
    id: 'a1',
    title: 'CRITICAL: Imminent Landslide Risk — Sohra',
    description: 'Multiple sensors detecting rapid slope movement and extreme soil saturation in Sohra-Cherrapunji Zone. Risk score has exceeded critical threshold. Immediate evacuation advisory recommended.',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    zoneId: 'z1',
    source: 'AI Risk Engine',
    timestamp: min(15),
  },
  {
    id: 'a2',
    title: 'WARNING: Heavy Rainfall — East Khasi Hills',
    description: 'IMD predicts very heavy rainfall (150-200mm) over next 24 hours in East Khasi Hills district. All field teams advised to exercise caution.',
    severity: 'WARNING',
    status: 'ACTIVE',
    zoneId: 'z1',
    source: 'IMD',
    timestamp: hour(2),
  },
  {
    id: 'a3',
    title: 'WARNING: NH-40 Slope Instability',
    description: 'Inclinometer readings at NH-40 Km 42 show accelerating slope movement. Rate of change exceeds warning threshold.',
    severity: 'WARNING',
    status: 'ACKNOWLEDGED',
    zoneId: 'z2',
    source: 'Sensor Network',
    timestamp: hour(4),
    acknowledgedBy: 'Cmdr. R. Sharma',
    acknowledgedAt: hour(3),
  },
  {
    id: 'a4',
    title: 'WATCH: Aizawl Ridge Drainage Overload',
    description: 'Urban drainage systems in Aizawl Ridge sector approaching capacity. Continued rainfall may trigger secondary slope failures.',
    severity: 'WATCH',
    status: 'ACTIVE',
    zoneId: 'z8',
    source: 'Field Report',
    timestamp: hour(6),
  },
  {
    id: 'a5',
    title: 'INFO: Sensor Maintenance — NH-40 Extensometer',
    description: 'Extensometer at NH-40 Km 42 undergoing scheduled maintenance. Manual monitoring in place.',
    severity: 'INFO',
    status: 'ACTIVE',
    zoneId: 'z2',
    source: 'System',
    timestamp: hour(12),
  },
  {
    id: 'a6',
    title: 'WARNING: Mawsynram Record Rainfall',
    description: 'Mawsynram AWS recording 210mm in past 24 hours, exceeding seasonal average. Debris flow risk elevated.',
    severity: 'WARNING',
    status: 'ACTIVE',
    zoneId: 'z3',
    source: 'Weather Station',
    timestamp: hour(1),
  },
  {
    id: 'a7',
    title: 'WATCH: Kohima Construction Zone',
    description: 'Ongoing construction activity near Kohima bypass creating unstable conditions. Rain forecast may worsen situation.',
    severity: 'WATCH',
    status: 'ACKNOWLEDGED',
    zoneId: 'z7',
    source: 'Field Inspection',
    timestamp: hour(8),
    acknowledgedBy: 'Eng. Kikon',
    acknowledgedAt: hour(7),
  },
  {
    id: 'a8',
    title: 'CRITICAL: Aizawl Sensor Offline',
    description: 'Rain gauge at Aizawl AWS has gone offline. Battery critically low. No redundant coverage available for this zone.',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    zoneId: 'z8',
    source: 'System Monitor',
    timestamp: min(45),
  },
];

// ============================================================
// INCIDENTS — 5 incidents at various stages
// ============================================================
export const mockIncidents: Incident[] = [
  {
    id: 'i1',
    title: 'Major Landslide — Sohra-Cherrapunji Slope',
    description: 'Large debris flow on the main slope in Sohra affecting approximately 200m of hillside. Road partially blocked. Multiple structures at risk.',
    severity: 'SEVERE',
    status: 'RESPONDING',
    zoneId: 'z1',
    coordinates: [91.7340, 25.2670],
    reportedAt: hour(3),
    verifiedAt: hour(2.5),
    casualties: 0,
    injuries: 2,
    structuresDamaged: 4,
  },
  {
    id: 'i2',
    title: 'Rockfall on NH-40 near Nongpoh',
    description: 'Medium-scale rockfall partially blocking both lanes of NH-40 near Km 42. Traffic diverted through alternate route.',
    severity: 'MODERATE',
    status: 'VERIFIED',
    zoneId: 'z2',
    coordinates: [91.8680, 25.9010],
    reportedAt: hour(5),
    verifiedAt: hour(4),
    casualties: 0,
    injuries: 0,
    structuresDamaged: 0,
  },
  {
    id: 'i3',
    title: 'Debris Flow — Mawsynram Ridge',
    description: 'Small debris flow along Mawsynram ridge trail. No casualties. Trail blocked for approximately 50m.',
    severity: 'MINOR',
    status: 'RECOVERY',
    zoneId: 'z3',
    coordinates: [91.5840, 25.3010],
    reportedAt: hour(24),
    verifiedAt: hour(23),
    closedAt: undefined,
    casualties: 0,
    injuries: 0,
    structuresDamaged: 1,
  },
  {
    id: 'i4',
    title: 'Ground Subsidence — Aizawl Ridge',
    description: 'Significant ground subsidence detected in residential area of Aizawl Ridge sector. 12 families evacuated as precaution.',
    severity: 'SEVERE',
    status: 'REPORTED',
    zoneId: 'z8',
    coordinates: [92.7180, 23.7280],
    reportedAt: min(30),
    casualties: 0,
    injuries: 0,
    structuresDamaged: 2,
  },
  {
    id: 'i5',
    title: 'Road Crack — Kohima Bypass',
    description: 'New transverse crack observed on Kohima bypass road surface. Width ~5cm, length ~8m. Monitoring initiated.',
    severity: 'MINOR',
    status: 'VERIFIED',
    zoneId: 'z7',
    coordinates: [94.1100, 25.6700],
    reportedAt: hour(10),
    verifiedAt: hour(9),
    casualties: 0,
    injuries: 0,
    structuresDamaged: 0,
  },
];

// ============================================================
// INCIDENT EVENTS (timeline entries)
// ============================================================
export const mockIncidentEvents: Record<string, IncidentEvent[]> = {
  i1: [
    { id: 'ie1', incidentId: 'i1', timestamp: hour(3), description: 'Landslide reported by local residents via emergency helpline', recordedBy: 'Control Room' },
    { id: 'ie2', incidentId: 'i1', timestamp: hour(2.8), description: 'Sensor data confirmed — inclinometer readings exceed critical threshold', recordedBy: 'AI Risk Engine' },
    { id: 'ie3', incidentId: 'i1', timestamp: hour(2.5), description: 'Field team dispatched for verification', recordedBy: 'Cmdr. R. Sharma' },
    { id: 'ie4', incidentId: 'i1', timestamp: hour(2.3), description: 'Incident verified by field team. Debris flow confirmed ~200m extent', recordedBy: 'Field Team Alpha' },
    { id: 'ie5', incidentId: 'i1', timestamp: hour(2), description: 'SDRF Unit deployed. 2 injuries reported, first aid administered', recordedBy: 'SDRF Shillong' },
    { id: 'ie6', incidentId: 'i1', timestamp: hour(1.5), description: 'Evacuation of 45 families initiated via Route ER-1', recordedBy: 'Evacuation Coordinator' },
    { id: 'ie7', incidentId: 'i1', timestamp: hour(1), description: 'Heavy machinery requested for road clearing', recordedBy: 'Cmdr. R. Sharma' },
    { id: 'ie8', incidentId: 'i1', timestamp: min(30), description: 'All 45 families safely evacuated to Sohra HSS Shelter', recordedBy: 'Shelter Manager' },
  ],
  i2: [
    { id: 'ie9', incidentId: 'i2', timestamp: hour(5), description: 'Rockfall reported by truck driver on NH-40', recordedBy: 'Control Room' },
    { id: 'ie10', incidentId: 'i2', timestamp: hour(4.5), description: 'Traffic police dispatched for traffic management', recordedBy: 'SP Office' },
    { id: 'ie11', incidentId: 'i2', timestamp: hour(4), description: 'Field team verified rockfall. Both lanes partially blocked', recordedBy: 'Field Team Bravo' },
  ],
};

// ============================================================
// RESOURCES — 15 response resources
// ============================================================
export const mockResources: Resource[] = [
  { id: 'r01', name: 'SDRF Unit Alpha — Shillong', type: 'RESCUE_TEAM', status: 'DISPATCHED', location: [91.7340, 25.2670], assignedIncidentId: 'i1', capacity: 25, contactPerson: 'Cmdr. R. Sharma', contactPhone: '+91-9876543210' },
  { id: 'r02', name: 'SDRF Unit Bravo — Guwahati', type: 'RESCUE_TEAM', status: 'AVAILABLE', location: [91.7460, 26.1445], capacity: 20, contactPerson: 'Cmdr. Bora', contactPhone: '+91-9876543211' },
  { id: 'r03', name: 'NDRF Team 12', type: 'RESCUE_TEAM', status: 'AVAILABLE', location: [91.8900, 25.5700], capacity: 30, contactPerson: 'Cmdr. Dey', contactPhone: '+91-9876543212' },
  { id: 'r04', name: 'Ambulance — Civil Hospital Shillong', type: 'MEDICAL_TEAM', status: 'AVAILABLE', location: [91.8833, 25.5667], capacity: 4, contactPerson: 'Dr. Lyndem', contactPhone: '+91-9876543213' },
  { id: 'r05', name: 'Ambulance — Nongpoh PHC', type: 'MEDICAL_TEAM', status: 'DISPATCHED', location: [91.8667, 25.9000], assignedIncidentId: 'i2', capacity: 4, contactPerson: 'Dr. Nongrum', contactPhone: '+91-9876543214' },
  { id: 'r06', name: 'JCB Excavator — PWD Shillong', type: 'HEAVY_MACHINERY', status: 'AVAILABLE', location: [91.8700, 25.5600], capacity: 1, contactPerson: 'Eng. Khongwir', contactPhone: '+91-9876543215' },
  { id: 'r07', name: 'Hitachi Excavator — NHAI', type: 'HEAVY_MACHINERY', status: 'DISPATCHED', location: [91.7340, 25.2670], assignedIncidentId: 'i1', capacity: 1, contactPerson: 'Eng. Das', contactPhone: '+91-9876543216' },
  { id: 'r08', name: 'Police Unit — Sohra PS', type: 'VEHICLE', status: 'ON_SCENE', location: [91.7333, 25.2667], assignedIncidentId: 'i1', capacity: 8, contactPerson: 'SI Nongbri', contactPhone: '+91-9876543217' },
  { id: 'r09', name: 'Relief Kit Truck — DC Office', type: 'RELIEF_SUPPLIES', status: 'AVAILABLE', location: [91.8800, 25.5650], capacity: 500, contactPerson: 'ADC Warjri', contactPhone: '+91-9876543218' },
  { id: 'r10', name: 'Mobile Medical Unit — Health Dept', type: 'MEDICAL_TEAM', status: 'AVAILABLE', location: [91.8850, 25.5680], capacity: 6, contactPerson: 'Dr. Marak', contactPhone: '+91-9876543219' },
  { id: 'r11', name: 'SDRF Unit Charlie — Aizawl', type: 'RESCUE_TEAM', status: 'AVAILABLE', location: [92.7176, 23.7271], capacity: 20, contactPerson: 'Cmdr. Lalringa', contactPhone: '+91-9876543220' },
  { id: 'r12', name: 'Fire Service — Kohima', type: 'RESCUE_TEAM', status: 'AVAILABLE', location: [94.1100, 25.6700], capacity: 15, contactPerson: 'CFO Zhimomi', contactPhone: '+91-9876543221' },
  { id: 'r13', name: 'Drone Unit — Survey of India', type: 'VEHICLE', status: 'AVAILABLE', location: [91.8830, 25.5660], capacity: 2, contactPerson: 'Tech. Barua', contactPhone: '+91-9876543222' },
  { id: 'r14', name: 'Water Tanker — PHE Dept', type: 'RELIEF_SUPPLIES', status: 'AVAILABLE', location: [91.8750, 25.5640], capacity: 10000, contactPerson: 'AE Syngkon', contactPhone: '+91-9876543223' },
  { id: 'r15', name: 'Ambulance — NEIGRIHMS', type: 'MEDICAL_TEAM', status: 'AVAILABLE', location: [91.8900, 25.5800], capacity: 4, contactPerson: 'Dr. Singh', contactPhone: '+91-9876543224' },
];

// ============================================================
// SHELTERS — 8 emergency shelters
// ============================================================
export const mockShelters: Shelter[] = [
  { id: 'sh1', name: 'Sohra Higher Secondary School', district: 'East Khasi Hills', coordinates: [91.7300, 25.2700], capacity: 500, currentOccupancy: 185, facilities: ['Water', 'Electricity', 'Medical Camp', 'Kitchen'], contactPerson: 'Principal Dkhar', contactPhone: '+91-8765432101' },
  { id: 'sh2', name: 'Mawphlang Community Hall', district: 'East Khasi Hills', coordinates: [91.7500, 25.4500], capacity: 300, currentOccupancy: 0, facilities: ['Water', 'Electricity'], contactPerson: 'Headman Lyngdoh', contactPhone: '+91-8765432102' },
  { id: 'sh3', name: 'Nongpoh Relief Camp', district: 'Ri-Bhoi', coordinates: [91.8650, 25.9050], capacity: 400, currentOccupancy: 45, facilities: ['Water', 'Electricity', 'Kitchen', 'Toilets'], contactPerson: 'BDO Nongpoh', contactPhone: '+91-8765432103' },
  { id: 'sh4', name: 'Shillong Indoor Stadium', district: 'East Khasi Hills', coordinates: [91.8833, 25.5700], capacity: 1200, currentOccupancy: 0, facilities: ['Water', 'Electricity', 'Medical Camp', 'Kitchen', 'Toilets', 'Generator'], contactPerson: 'Sports Director', contactPhone: '+91-8765432104' },
  { id: 'sh5', name: 'Aizawl Community Centre', district: 'Aizawl', coordinates: [92.7180, 23.7300], capacity: 600, currentOccupancy: 48, facilities: ['Water', 'Electricity', 'Kitchen'], contactPerson: 'Ward Councillor', contactPhone: '+91-8765432105' },
  { id: 'sh6', name: 'Kohima Relief Centre', district: 'Kohima', coordinates: [94.1120, 25.6720], capacity: 350, currentOccupancy: 0, facilities: ['Water', 'Electricity', 'Toilets'], contactPerson: 'DC Office Kohima', contactPhone: '+91-8765432106' },
  { id: 'sh7', name: 'Itanagar School Complex', district: 'Papumpare', coordinates: [93.6200, 27.0860], capacity: 450, currentOccupancy: 0, facilities: ['Water', 'Electricity', 'Kitchen', 'Medical Camp'], contactPerson: 'ADC Papumpare', contactPhone: '+91-8765432107' },
  { id: 'sh8', name: 'Imphal Sports Complex', district: 'Imphal East', coordinates: [93.9380, 24.8180], capacity: 800, currentOccupancy: 0, facilities: ['Water', 'Electricity', 'Kitchen', 'Toilets', 'Generator', 'Medical Camp'], contactPerson: 'Director Sports', contactPhone: '+91-8765432108' },
];

// ============================================================
// EVACUATION ROUTES — 5 routes
// ============================================================
export const mockEvacuationRoutes: EvacuationRoute[] = [
  { id: 'er1', name: 'Sohra Primary Route', originZoneId: 'z1', destinationShelterId: 'sh1', path: [[91.7333, 25.2667], [91.7320, 25.2680], [91.7300, 25.2700]], estimatedTimeMinutes: 15, isSafe: true, blockages: [] },
  { id: 'er2', name: 'Sohra Alternate Route', originZoneId: 'z1', destinationShelterId: 'sh2', path: [[91.7333, 25.2667], [91.7400, 25.3000], [91.7450, 25.3500], [91.7500, 25.4500]], estimatedTimeMinutes: 45, isSafe: true, blockages: [] },
  { id: 'er3', name: 'NH-40 Diversion Route', originZoneId: 'z2', destinationShelterId: 'sh3', path: [[91.8667, 25.9000], [91.8660, 25.9030], [91.8650, 25.9050]], estimatedTimeMinutes: 10, isSafe: true, blockages: [] },
  { id: 'er4', name: 'Aizawl Ridge Evacuation', originZoneId: 'z8', destinationShelterId: 'sh5', path: [[92.7176, 23.7271], [92.7178, 23.7285], [92.7180, 23.7300]], estimatedTimeMinutes: 20, isSafe: true, blockages: [] },
  { id: 'er5', name: 'Kohima Bypass Route', originZoneId: 'z7', destinationShelterId: 'sh6', path: [[94.1100, 25.6700], [94.1110, 25.6710], [94.1120, 25.6720]], estimatedTimeMinutes: 12, isSafe: false, blockages: [[94.1105, 25.6705]] },
];

// ============================================================
// FIELD REPORTS — 6 reports
// ============================================================
export const mockFieldReports: FieldReport[] = [
  { id: 'fr1', incidentId: 'i1', type: 'DAMAGE_ASSESSMENT', description: 'Large debris flow covering approximately 200m of hillside. 4 structures partially damaged. Road blocked.', reportedBy: 'Field Team Alpha', coordinates: [91.7340, 25.2670], timestamp: hour(2.3), attachments: [], syncStatus: 'SYNCED' },
  { id: 'fr2', incidentId: 'i1', type: 'OBSERVATION', description: 'Continued slope movement observed above the primary debris flow. Additional cracking visible at crown.', reportedBy: 'Geologist Dr. Nongkynrih', coordinates: [91.7345, 25.2680], timestamp: hour(1), attachments: [], syncStatus: 'SYNCED' },
  { id: 'fr3', incidentId: 'i2', type: 'DAMAGE_ASSESSMENT', description: 'Rockfall debris blocking both lanes. Estimated 50 cubic meters of material. No structural damage to road surface.', reportedBy: 'Field Team Bravo', coordinates: [91.8680, 25.9010], timestamp: hour(4), attachments: [], syncStatus: 'SYNCED' },
  { id: 'fr4', type: 'OBSERVATION', description: 'New crack observed on Kohima bypass road. Width ~5cm, length ~8m. Water seepage visible.', reportedBy: 'Traffic Inspector Kikon', coordinates: [94.1100, 25.6700], timestamp: hour(10), attachments: [], syncStatus: 'SYNCED' },
  { id: 'fr5', incidentId: 'i4', type: 'RESOURCE_REQUEST', description: 'Requesting geotechnical assessment team for ground subsidence area in Aizawl. 12 families at immediate risk.', reportedBy: 'Ward Officer Lalremmawia', coordinates: [92.7180, 23.7280], timestamp: min(25), attachments: [], syncStatus: 'PENDING' },
  { id: 'fr6', type: 'OBSERVATION', description: 'Drainage channel near Nongstoin highway corridor overflowing. Water pooling on road surface.', reportedBy: 'PWD Patrol', coordinates: [91.2660, 25.5210], timestamp: min(10), attachments: [], syncStatus: 'SYNCED' },
];

// ============================================================
// SENSOR READINGS — Sample time series data
// ============================================================
export function generateSensorReadings(sensorId: string, count: number): SensorReading[] {
  const readings: SensorReading[] = [];
  for (let i = 0; i < count; i++) {
    readings.push({
      id: `${sensorId}-r${i}`,
      sensorId,
      timestamp: new Date(now.getTime() - (count - i) * 600000), // 10 min intervals
      value: Math.random() * 100 + (sensorId.includes('s01') ? 80 : 20),
      unit: 'mm',
      isAnomaly: Math.random() > 0.92,
    });
  }
  return readings;
}

// ============================================================
// RAINFALL TIME SERIES — for charts
// ============================================================
export const mockRainfallTimeSeries = Array.from({ length: 48 }, (_, i) => ({
  timestamp: new Date(now.getTime() - (48 - i) * 3600000),
  amountMm: Math.max(0, Math.sin(i / 6) * 30 + 15 + Math.random() * 20 + (i > 30 ? i * 2 : 0)),
  intensityMmPerHour: Math.max(0, Math.sin(i / 6) * 15 + 8 + Math.random() * 10),
}));

// ============================================================
// RISK SCORE TIME SERIES — for charts
// ============================================================
export const mockRiskScoreTimeSeries = Array.from({ length: 48 }, (_, i) => ({
  timestamp: new Date(now.getTime() - (48 - i) * 3600000),
  score: Math.min(100, Math.max(0, 30 + i * 1.2 + Math.sin(i / 4) * 10 + Math.random() * 5)),
  level: (i < 15 ? 'LOW' : i < 30 ? 'MODERATE' : i < 40 ? 'HIGH' : 'CRITICAL') as 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL',
}));

// ============================================================
// SERVICE HEALTH
// ============================================================
export const mockServiceHealth: ServiceHealth[] = [
  { name: 'API', status: 'ONLINE', latencyMs: 45, lastChecked: min(1) },
  { name: 'DATABASE', status: 'ONLINE', latencyMs: 12, lastChecked: min(1) },
  { name: 'WEBSOCKET', status: 'ONLINE', latencyMs: 8, lastChecked: min(1) },
  { name: 'MODEL_ENGINE', status: 'DEGRADED', latencyMs: 2400, lastChecked: min(2) },
];

// ============================================================
// ANALYTICS DATA
// ============================================================
export const mockMonthlyIncidents = [
  { month: 'Jan', count: 3 }, { month: 'Feb', count: 2 }, { month: 'Mar', count: 5 },
  { month: 'Apr', count: 8 }, { month: 'May', count: 12 }, { month: 'Jun', count: 28 },
  { month: 'Jul', count: 35 }, { month: 'Aug', count: 31 }, { month: 'Sep', count: 22 },
  { month: 'Oct', count: 14 }, { month: 'Nov', count: 6 }, { month: 'Dec', count: 2 },
];

export const mockDistrictComparison = [
  { district: 'East Khasi Hills', incidents: 42, riskScore: 78 },
  { district: 'Ri-Bhoi', incidents: 28, riskScore: 72 },
  { district: 'West Khasi Hills', incidents: 22, riskScore: 58 },
  { district: 'Aizawl', incidents: 18, riskScore: 68 },
  { district: 'Kohima', incidents: 15, riskScore: 52 },
  { district: 'Papumpare', incidents: 12, riskScore: 45 },
  { district: 'West Jaintia Hills', incidents: 10, riskScore: 42 },
  { district: 'Imphal East', incidents: 5, riskScore: 28 },
];

export const mockResponseTimes = [
  { range: '< 15 min', count: 8 }, { range: '15-30 min', count: 15 },
  { range: '30-60 min', count: 22 }, { range: '1-2 hr', count: 18 },
  { range: '2-4 hr', count: 12 }, { range: '> 4 hr', count: 5 },
];

export const mockAlertsByType = [
  { type: 'CRITICAL', count: 8 }, { type: 'WARNING', count: 24 },
  { type: 'WATCH', count: 35 }, { type: 'INFO', count: 42 },
];
