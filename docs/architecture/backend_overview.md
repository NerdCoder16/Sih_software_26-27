# Backend Architecture Overview

The **AI-Based Early Warning and Landslide Risk Monitoring Platform Backend** for North Eastern Region (NER) is built using **Python 3.10+**, **FastAPI**, **Pydantic v2**, **SQLAlchemy 2.0**, and **WebSockets**.

## Core Subsystems

1. **Deterministic Risk Engine (`risk_engine.py`)**:
   - Calculates real-time susceptibility score (0–100) and risk levels (`SAFE`, `LOW`, `MODERATE`, `HIGH`, `CRITICAL`).
   - Computes explainable factor attribution ("WHY DID RISK CHANGE?").

2. **Sensor Ingestion Pipeline (`POST /api/v1/sensors/readings`)**:
   - Ingests telemetry for pore water pressure, soil moisture, tilt angle, and rainfall intensity.
   - Evaluates risk transitions and triggers automated warning broadcasts.

3. **Digital Twin Simulation Engine (`simulation_service.py`)**:
   - Executes an 11-stage disaster propagation model (`NORMAL` to `RECOVERY`) at 1x to 50x speeds.

4. **Real-Time WebSocket Protocol (`/ws/live`)**:
   - Broadcasts real-time events (`SENSOR_READING`, `RISK_UPDATE`, `ALERT_CREATED`, `INCIDENT_UPDATED`, `RESOURCE_MOVED`, `SIMULATION_PHASE_CHANGED`).
