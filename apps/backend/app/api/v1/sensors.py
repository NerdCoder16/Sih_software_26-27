import json
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import SensorModel, SensorReadingModel, RiskZoneModel
from app.schemas.domain import ApiResponse, SensorSchema, SensorReadingSchema, SensorReadingCreateSchema
from app.services.risk_engine import risk_engine
from app.services.alert_service import alert_service
from app.realtime.manager import manager

router = APIRouter()

@router.get("", response_model=ApiResponse)
def get_sensors(db: Session = Depends(get_db)):
    sensors = db.query(SensorModel).all()
    result = []
    for s in sensors:
        coords = json.loads(s.coordinates_json) if s.coordinates_json else [0.0, 0.0]
        latest = db.query(SensorReadingModel).filter(SensorReadingModel.sensor_id == s.id).order_by(SensorReadingModel.timestamp.desc()).first()
        
        last_reading = None
        if latest:
            last_reading = SensorReadingSchema(
                id=latest.id,
                sensorId=latest.sensor_id,
                timestamp=latest.timestamp,
                value=latest.value,
                unit=latest.unit,
                isAnomaly=latest.is_anomaly,
                quality=latest.quality
            )

        result.append(SensorSchema(
            id=s.id,
            zoneId=s.zone_id,
            type=s.type,
            name=s.name,
            coordinates=coords,
            status=s.status,
            installationDate=s.installation_date,
            lastMaintenance=s.last_maintenance,
            batteryLevel=s.battery_level,
            lastReading=last_reading,
            isDemo=s.is_demo
        ))
    return ApiResponse(success=True, data=result)

@router.post("/readings", response_model=ApiResponse)
async def post_sensor_reading(
    reading_in: SensorReadingCreateSchema, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    sensor = db.query(SensorModel).filter(SensorModel.id == reading_in.sensorId).first()
    if not sensor:
        raise HTTPException(status_code=404, detail=f"Sensor {reading_in.sensorId} not found")

    reading_id = f"rd-{uuid.uuid4().hex[:8]}"
    db_reading = SensorReadingModel(
        id=reading_id,
        sensor_id=reading_in.sensorId,
        timestamp=reading_in.timestamp or datetime.utcnow(),
        value=reading_in.value,
        unit=reading_in.unit,
        is_anomaly=reading_in.isAnomaly or False,
        quality=reading_in.quality or 1.0
    )
    db.add(db_reading)
    
    # Update sensor status if anomaly
    if reading_in.isAnomaly:
        sensor.status = "DEGRADED"

    db.commit()

    # Recalculate Risk Zone Score
    zone = db.query(RiskZoneModel).filter(RiskZoneModel.id == sensor.zone_id).first()
    new_alert_data = None
    risk_data = None

    if zone:
        # Pass reading to risk engine
        rain = reading_in.value if sensor.type in ["RAIN_GAUGE", "WEATHER_STATION"] else 40.0
        soil = reading_in.value if sensor.type == "SOIL_MOISTURE" else 75.0
        tilt = reading_in.value if sensor.type in ["INCLINOMETER", "TILT_METER"] else 2.0

        new_score, new_level, factors, reason = risk_engine.calculate_risk(
            rainfall_intensity=rain,
            cumulative_rainfall_24h=rain * 2.5,
            soil_saturation_pct=soil,
            pore_pressure_kpa=35.0,
            slope_tilt_mm=tilt
        )

        old_level = zone.current_risk_level
        zone.risk_score = new_score
        zone.current_risk_level = new_level
        zone.factors_json = json.dumps([f.model_dump() for f in factors])
        zone.last_updated = datetime.utcnow()

        db.commit()

        risk_data = {
            "zoneId": zone.id,
            "previousLevel": old_level,
            "newRiskLevel": new_level,
            "score": new_score,
            "reason": reason
        }

        # Check threshold alert
        if new_level in ["HIGH", "CRITICAL"] and old_level != new_level:
            created_alert = alert_service.create_threshold_alert(db, zone.id, zone.name, new_level, new_score)
            if created_alert:
                new_alert_data = created_alert.model_dump()

    # Broadcast WebSocket Real-Time Events
    background_tasks.add_task(manager.broadcast, "SENSOR_READING", {
        "id": reading_id,
        "sensorId": reading_in.sensorId,
        "value": reading_in.value,
        "unit": reading_in.unit,
        "isAnomaly": reading_in.isAnomaly,
        "timestamp": db_reading.timestamp.isoformat()
    })

    if risk_data:
        background_tasks.add_task(manager.broadcast, "RISK_UPDATE", risk_data)

    if new_alert_data:
        background_tasks.add_task(manager.broadcast, "ALERT_CREATED", new_alert_data)

    return ApiResponse(
        success=True,
        data={
            "readingId": reading_id,
            "sensorId": reading_in.sensorId,
            "riskLevel": zone.current_risk_level if zone else "SAFE",
            "riskScore": zone.risk_score if zone else 0.0
        },
        message="Sensor reading processed and risk pipeline evaluated"
    )
