# Backend Integration Requirements

## Overview
This document outlines what the backend team needs to implement to support the frontend application.

## 1. APIs & WebSockets
- Implement all REST endpoints defined in `API_CONTRACT.md`.
- Implement WebSocket server handling events defined in `WEBSOCKET_EVENTS.md`.

## 2. Database Schema Requirements
Key entities required:
- `Sensor` (ID, Location, Type, Status)
- `SensorReading` (SensorID, Value, Timestamp) -> Needs Time-Series optimized DB.
- `RiskZone` (ID, Geometry, CurrentLevel, LastUpdated)
- `Incident` (ID, Location, Severity, Status)
- `Alert` (ID, Type, Message, AcknowledgedBy, Timestamp)
- `Resource` (ID, Type, Location, Status)

## 3. Authentication
- JWT based authentication.
- Endpoints must validate the `Authorization: Bearer <token>` header.

## 4. Data Ingestion Pipeline
Backend must ingest data from:
- Real IoT sensors (MQTT/HTTP).
- IMD Weather APIs.
- ISRO Satellite data.
- GSI Geological APIs.

## 5. ML Model Integration
- Backend must periodically (or event-driven) pass sensor/weather data to the Risk Prediction ML model.
- Parse the output and update `RiskZone` entities.
- Trigger `risk.updated` WebSocket events if thresholds are crossed.

## 6. GIS Infrastructure
- Serve Vector Tiles (MVT) or GeoJSON for static layers (boundaries, historical landslide points).
- Host/proxy satellite imagery if required.

## 7. File Uploads
- Implement multipart/form-data endpoints for Field Reports (images/videos).
- Store in object storage (S3 equivalent) and return public URLs.

## 8. Notifications
- Integrate with SMS/Email/WhatsApp APIs to dispatch critical alerts.

## 9. Configuration
- Ensure proper CORS configuration to allow the frontend domain.
- Provide necessary environment variables for API keys and DB connections.

## 10. Performance
- WebSocket server must handle high-frequency sensor readings (consider debouncing on the server side before broadcasting).
- API should return paginated/filtered data for historical queries to prevent massive payload sizes.
