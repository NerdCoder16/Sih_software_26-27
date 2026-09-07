import json
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import FieldReportModel
from app.schemas.domain import ApiResponse, FieldReportCreateSchema, FieldReportSchema
from app.realtime.manager import manager

router = APIRouter()

@router.get("", response_model=ApiResponse)
def get_field_reports(db: Session = Depends(get_db)):
    reports = db.query(FieldReportModel).all()
    result = []
    for r in reports:
        coords = json.loads(r.coordinates_json) if r.coordinates_json else [0.0, 0.0]
        result.append(FieldReportSchema(
            id=r.id,
            incidentId=r.incident_id,
            type=r.type,
            description=r.description,
            reportedBy=r.reported_by,
            coordinates=coords,
            timestamp=r.timestamp,
            severity=r.severity,
            syncStatus=r.sync_status,
            isDemo=r.is_demo
        ))
    return ApiResponse(success=True, data=result)

@router.post("", response_model=ApiResponse)
async def create_field_report(
    report_in: FieldReportCreateSchema,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    report_id = f"fr-{uuid.uuid4().hex[:8]}"
    now = datetime.utcnow()

    db_report = FieldReportModel(
        id=report_id,
        incident_id=report_in.incidentId,
        type=report_in.type,
        description=report_in.description,
        reported_by=report_in.reportedBy,
        coordinates_json=json.dumps(report_in.coordinates),
        timestamp=now,
        severity=report_in.severity or 3,
        attachments_json=json.dumps([]),
        sync_status="SYNCED",
        is_demo=True
    )
    db.add(db_report)
    db.commit()

    schema_data = FieldReportSchema(
        id=report_id,
        incidentId=report_in.incidentId,
        type=report_in.type,
        description=report_in.description,
        reportedBy=report_in.reportedBy,
        coordinates=report_in.coordinates,
        timestamp=now,
        severity=report_in.severity or 3,
        syncStatus="SYNCED",
        isDemo=True
    )

    background_tasks.add_task(manager.broadcast, "FIELD_REPORT_CREATED", schema_data.model_dump())

    return ApiResponse(success=True, data=schema_data, message="Field report logged successfully")
