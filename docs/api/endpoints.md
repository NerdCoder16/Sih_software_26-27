# REST API & WebSocket Endpoint Reference

Base API Path: `/api/v1`

## Endpoints Summary

- `GET /api/v1/zones` — List all risk zones
- `GET /api/v1/zones/{id}` — Get single risk zone details
- `GET /api/v1/zones/{id}/history` — Get historical risk timeline
- `GET /api/v1/sensors` — List all sensors & latest telemetry
- `POST /api/v1/sensors/readings` — Ingest sensor telemetry & evaluate real-time risk pipeline
- `GET /api/v1/alerts` — List active/acknowledged warnings
- `POST /api/v1/alerts/{id}/acknowledge` — Acknowledge alert
- `GET /api/v1/incidents` — List active & past incidents
- `GET /api/v1/incidents/{id}` — Get incident details & timeline
- `POST /api/v1/incidents` — Report new incident
- `PUT /api/v1/incidents/{id}/status` — Update incident lifecycle state
- `GET /api/v1/resources` — List emergency response resources
- `POST /api/v1/resources/{id}/dispatch` — Dispatch resource to incident
- `GET /api/v1/shelters` — List relief shelters and occupancy
- `GET /api/v1/evacuation-routes` — List pre-planned evacuation corridors
- `POST /api/v1/field-reports` — Log ground observation report
- `GET /api/v1/health` — System status for 9 core services
- `GET /api/v1/simulation/state` — Digital twin simulation state
- `POST /api/v1/simulation/control` — Control simulation execution (START, PAUSE, RESET, STEP, SET_SPEED, SET_PHASE)
- `WS /ws/live` — WebSocket stream for real-time state events
