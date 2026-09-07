from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.domain import ApiResponse
from app.services.alert_service import alert_service
from app.realtime.manager import manager

router = APIRouter()

@router.get("", response_model=ApiResponse)
def get_alerts(db: Session = Depends(get_db)):
    alerts = alert_service.get_alerts(db)
    return ApiResponse(success=True, data=alerts)

@router.post("/{alert_id}/acknowledge", response_model=ApiResponse)
async def acknowledge_alert(
    alert_id: str, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    ack_alert = alert_service.acknowledge_alert(db, alert_id)
    if not ack_alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    background_tasks.add_task(manager.broadcast, "ALERT_UPDATED", ack_alert.model_dump())

    return ApiResponse(success=True, data=ack_alert, message="Alert acknowledged")
