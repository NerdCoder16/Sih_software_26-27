from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.domain import ApiResponse, ResourceDispatchSchema
from app.services.resource_service import resource_service
from app.realtime.manager import manager

router = APIRouter()

@router.get("", response_model=ApiResponse)
def get_resources(db: Session = Depends(get_db)):
    resources = resource_service.get_resources(db)
    return ApiResponse(success=True, data=resources)

@router.post("/{resource_id}/dispatch", response_model=ApiResponse)
async def dispatch_resource(
    resource_id: str, 
    dispatch_in: ResourceDispatchSchema,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    res = resource_service.dispatch_resource(db, resource_id, dispatch_in.incidentId)
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")

    background_tasks.add_task(manager.broadcast, "RESOURCE_MOVED", res.model_dump())
    return ApiResponse(success=True, data=res, message=f"Resource {resource_id} dispatched to incident {dispatch_in.incidentId}")
