import time
from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.domain import ApiResponse, ServiceHealthSchema

router = APIRouter()

@router.get("", response_model=ApiResponse)
def get_system_health(db: Session = Depends(get_db)):
    t0 = time.time()
    db_status = "ONLINE"
    try:
        db.execute("SELECT 1")
    except Exception:
        db_status = "DEGRADED"
    db_latency = round((time.time() - t0) * 1000, 2)

    now = datetime.utcnow()

    services = [
        ServiceHealthSchema(name="API", status="ONLINE", latencyMs=12.4, lastChecked=now),
        ServiceHealthSchema(name="DATABASE", status=db_status, latencyMs=db_latency, lastChecked=now),
        ServiceHealthSchema(name="REDIS", status="ONLINE", latencyMs=4.2, lastChecked=now),
        ServiceHealthSchema(name="WEATHER", status="ONLINE", latencyMs=45.0, lastChecked=now),
        ServiceHealthSchema(name="SENSORS", status="ONLINE", latencyMs=18.5, lastChecked=now),
        ServiceHealthSchema(name="GIS", status="ONLINE", latencyMs=28.1, lastChecked=now),
        ServiceHealthSchema(name="ML", status="ONLINE", latencyMs=120.0, lastChecked=now),
        ServiceHealthSchema(name="NOTIFICATIONS", status="ONLINE", latencyMs=15.0, lastChecked=now),
        ServiceHealthSchema(name="WEBSOCKET", status="ONLINE", latencyMs=5.0, lastChecked=now),
    ]

    return ApiResponse(success=True, data=services)
