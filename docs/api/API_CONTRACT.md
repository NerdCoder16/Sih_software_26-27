# REST API Contract

## 1. Base Configuration
- **Base URL**: `https://api.ewrs-ner.gov.in/v1`
- **Authentication**: JWT Bearer token in the `Authorization` header (`Authorization: Bearer <token>`).

## 2. Endpoints

### Dashboard
- **GET** `/dashboard/summary`
  - Returns aggregated counts (active alerts, critical sensors, active incidents).

### Risk Zones
- **GET** `/risk/zones`
  - Returns GeoJSON of all risk zones.
- **GET** `/risk/zones/{id}`
  - Returns detailed risk history and contributing factors for a zone.

### Sensors
- **GET** `/sensors`
  - Returns list of sensors and current health status.
- **GET** `/sensors/{id}/history`
  - Query parameters: `start_time`, `end_time`, `resolution`
  - Returns historical timeseries data.

### Weather
- **GET** `/weather/current`
  - Returns current meteorological data.
- **GET** `/weather/forecast`
  - Returns 48-hour precipitation forecast.

### Incidents
- **GET** `/incidents`
  - Query parameters: `status` (open/resolved)
  - Returns list of incidents.
- **POST** `/incidents`
  - Request body: `{ title, description, location: { lat, lng }, severity }`
- **PATCH** `/incidents/{id}/status`
  - Request body: `{ status: 'resolved' | 'investigating' }`

### Alerts
- **GET** `/alerts`
  - Query parameters: `acknowledged` (true/false)
- **POST** `/alerts/{id}/acknowledge`
  - Marks an alert as acknowledged by the operator.

### Field Reports
- **GET** `/reports`
- **POST** `/reports`
  - Request body: `multipart/form-data` with images and metadata.

### Resources & Shelters
- **GET** `/resources`
  - Returns available response teams and heavy machinery.
- **GET** `/shelters`
  - Returns shelter locations and current capacity.

### Analytics & Simulation
- **GET** `/analytics/historical-risk`
- **POST** `/simulation/start` (Admin only)
  - Request body: `{ scenarioId: string }`

### System Health
- **GET** `/system/health`
  - Returns status of DB, ML models, external APIs.

## 3. Standard Response Format
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2023-10-27T10:00:00Z"
  }
}
```

## 4. Error Responses
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Invalid location coordinates provided."
  }
}
```

## 5. Status Codes
- 200 OK
- 201 Created
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 500 Internal Server Error
