# WebSocket Protocol

## Connection Details
- **URL**: `ws://api.ewrs-ner.gov.in/ws`
- **Authentication**: Connect with token in query param `?token=<jwt>` or via initial auth message.
- **Heartbeat**: Client sends `{"type": "ping"}` every 30s. Server responds with `{"type": "pong"}`.
- **Reconnection**: Exponential backoff strategy (1s, 2s, 4s, 8s, max 30s) on disconnect.

## Message Format
All incoming messages follow this standard envelope:
```json
{
  "type": "event.type",
  "payload": { ... },
  "timestamp": "2023-10-27T10:05:00Z",
  "id": "msg-uuid-1234"
}
```

## Event Types

### `sensor.reading`
Emitted when a sensor reports new data.
```json
{
  "sensorId": "S-101",
  "type": "moisture",
  "value": 45.2,
  "unit": "%"
}
```

### `risk.updated`
Emitted when ML model updates risk map.
```json
{
  "zoneId": "Z-04",
  "newLevel": "HIGH",
  "previousLevel": "MODERATE",
  "probability": 0.82
}
```

### `risk.threshold_crossed`
Critical event when risk crosses into HIGH/SEVERE.

### `alert.created`
System generated alert.
```json
{
  "alertId": "A-992",
  "severity": "CRITICAL",
  "message": "High rainfall warning in East Khasi Hills"
}
```

### `alert.acknowledged`
Emitted when an operator acknowledges an alert.

### `field_report.created` / `field_report.verified`
Updates regarding citizen or officer reports.

### `incident.created` / `incident.status_changed`
Landslide occurrence tracking.

### `resource.dispatched`
Updates when teams/machinery are moved.

### `evacuation.started`
Triggers evacuation UI modes.

### `road.status_changed`
Road blockages or clearances.

### `shelter.updated`
Changes in shelter capacity.

### `simulation.started` / `simulation.phase_changed` / `simulation.completed`
Used specifically to drive the frontend during demo presentations.

### `system.health_changed`
Notifies if a subsystem (e.g., weather API) goes offline.
