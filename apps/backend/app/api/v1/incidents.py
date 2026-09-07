from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.domain import ApiResponse, IncidentCreateSchema
from app.services.incident_service import incident_service
from app.realtime.manager import manager

router = APIRouter()

class TransitionPayload(BaseModel):
    stage: str
    actor: str = "Command Officer"

@router.get("", response_model=ApiResponse)
def get_incidents(db: Session = Depends(get_db)):
    incidents = incident_service.get_incidents(db)
    return ApiResponse(success=True, data=incidents)

@router.get("/{incident_id}", response_model=ApiResponse)
def get_incident(incident_id: str, db: Session = Depends(get_db)):
    inc = incident_service.get_incident(db, incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    return ApiResponse(success=True, data=inc)

@router.post("", response_model=ApiResponse)
async def create_incident(
    payload: IncidentCreateSchema, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    inc = incident_service.create_incident(db, payload)
    background_tasks.add_task(manager.broadcast, "INCIDENT_CREATED", inc.model_dump())
    return ApiResponse(success=True, data=inc, message="Incident reported")

@router.put("/{incident_id}/status", response_model=ApiResponse)
async def update_incident_status(
    incident_id: str, 
    status: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    inc, error = incident_service.transition_stage(db, incident_id, status)
    if error:
        raise HTTPException(status_code=400, detail=error)

    background_tasks.add_task(manager.broadcast, "INCIDENT_UPDATED", inc.model_dump())
    return ApiResponse(success=True, data=inc, message=f"Incident status updated to {status}")

@router.post("/{incident_id}/transition", response_model=ApiResponse)
async def transition_incident_stage(
    incident_id: str,
    payload: TransitionPayload,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    inc, error = incident_service.transition_stage(db, incident_id, payload.stage, payload.actor)
    if error:
        raise HTTPException(status_code=400, detail=error)

    background_tasks.add_task(manager.broadcast, "INCIDENT_UPDATED", inc.model_dump())
    return ApiResponse(success=True, data=inc, message=f"Incident stage transitioned to {payload.stage}")
