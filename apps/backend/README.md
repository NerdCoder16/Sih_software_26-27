# NER Landslide EWRS — FastAPI Backend

Real-time disaster intelligence and early warning backend for the North Eastern Region of India (NER).

## Features
- **Deterministic Risk Engine**: Computes risk score (0–100), risk levels (`SAFE`, `LOW`, `MODERATE`, `HIGH`, `CRITICAL`), and explainable factor attribution.
- **Sensor Ingestion Pipeline**: Ingests pore water pressure, soil moisture, slope tilt, and rainfall gauge telemetry. Evaluates risk transitions dynamically.
- **Alert Engine**: Threshold-based warning triggers with deduplication and cooldown.
- **Incident Lifecycle Manager**: Tracks incidents from detection to recovery with timeline logging and priority scoring.
- **Resource Dispatch**: Manages SDRF, NDRF, medical, and heavy machinery units.
- **Digital Twin Simulation Engine**: Drives 11-stage disaster propagation scenarios at 1x to 50x speeds.
- **Real-Time WebSockets**: `/ws/live` channel broadcasting `SENSOR_READING`, `RISK_UPDATE`, `ALERT_CREATED`, `INCIDENT_UPDATED`, `RESOURCE_MOVED`, `SIMULATION_PHASE_CHANGED`.

## Running Locally

```bash
cd apps/backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive API documentation available at `http://localhost:8000/docs`.

## Running Pytest Tests

```bash
cd apps/backend
pytest
```
