# Simulation Engine Contract (Digital Twin)

## Overview
The simulation engine drives the frontend for DEMO mode and SIH presentations. It simulates a fast-forwarded landslide event in the Nongstoin area (East Khasi Hills, Meghalaya).

## Timing
Total simulation duration: ~5-8 minutes at 1x speed.

## Simulation Phases

### 1. NORMAL Phase (T=0 to T+1m)
- **Status**: Clear weather, all systems nominal.
- **Sensors**: Emitting standard baseline values.
- **Actions**: Presenter introduces the dashboard layout.

### 2. PRE-WARNING Phase (T+1m to T+2.5m)
- **Trigger**: Simulated heavy rainfall begins.
- **Sensors**: Soil moisture starts climbing. Rain gauges report high mm/hr.
- **Risk**: ML model updates Risk Zones from NORMAL to MODERATE.
- **Actions**: System generates "Heavy Rainfall Advisory" alert.

### 3. ESCALATION Phase (T+2.5m to T+4m)
- **Trigger**: Moisture crosses critical thresholds; inclinometers detect slight movement.
- **Risk**: Specific zones upgrade to HIGH/SEVERE.
- **Alerts**: Automated SMS/Push notifications simulated.
- **Actions**: Operator (Presenter) dispatches field verification teams.

### 4. INCIDENT Phase (T+4m to T+5.5m)
- **Trigger**: Major ground displacement simulated.
- **Event**: Landslide incident created on the map.
- **Impact**: Nearby road marked as BLOCKED.
- **Actions**: Evacuation protocols triggered.

### 5. RESPONSE & RECOVERY Phase (T+5.5m to T+7m)
- **Event**: Field reports arrive with images (mock data).
- **Actions**: Heavy machinery and NDRF resources dispatched to the incident site.
- **Shelters**: Capacity updates as simulated evacuees arrive.

## Data Generation Strategy
The Simulation Provider intercepts API and WebSocket calls. Instead of fetching from the backend, it uses predefined scripts (timelines) to emit WebSocket events and return mocked API responses that align with the current phase.

## Integration
To start the simulation, the frontend dispatches an action to the `simulation` Zustand store, which tells the `SimulationDataProvider` to start its internal timer and begin yielding events based on the script above.
