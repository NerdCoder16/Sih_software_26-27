import json
import uuid
from datetime import datetime
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from app.db.models import IncidentModel
from app.schemas.domain import IncidentSchema, IncidentEventSchema, IncidentCreateSchema

VALID_STAGES = [
    "DETECTED", "ASSESSING", "REPORTED", "VERIFIED", 
    "DECLARED", "RESPONDING", "EVACUATING", "RESCUE", 
    "CONTAINED", "RECOVERY", "CLOSED"
]

class IncidentService:
    def get_incidents(self, db: Session) -> List[IncidentSchema]:
        incidents = db.query(IncidentModel).all()
        result = []
        for i in incidents:
            coords = json.loads(i.coordinates_json) if i.coordinates_json else [0.0, 0.0]
            factors = json.loads(i.priority_factors_json) if i.priority_factors_json else []
            timeline_raw = json.loads(i.timeline_json) if i.timeline_json else []
            timeline = [IncidentEventSchema(**t) for t in timeline_raw]
            assigned = json.loads(i.assigned_resources_json) if i.assigned_resources_json else []

            result.append(IncidentSchema(
                id=i.id,
                title=i.title,
                description=i.description,
                severity=i.severity,
                status=i.status,
                zoneId=i.zone_id,
                coordinates=coords,
                reportedAt=i.reported_at,
                verifiedAt=i.verified_at,
                declaredAt=i.declared_at,
                closedAt=i.closed_at,
                casualties=i.casualties,
                injuries=i.injuries,
                structuresDamaged=i.structures_damaged,
                populationAffected=i.population_affected,
                roadsAffected=i.roads_affected,
                priorityScore=i.priority_score,
                priorityFactors=factors,
                timeline=timeline,
                assignedResources=assigned,
                isDemo=i.is_demo
            ))
        return result

    def get_incident(self, db: Session, incident_id: str) -> Optional[IncidentSchema]:
        incidents = self.get_incidents(db)
        for i in incidents:
            if i.id == incident_id:
                return i
        return None

    def create_incident(self, db: Session, payload: IncidentCreateSchema) -> IncidentSchema:
        inc_id = f"inc-{uuid.uuid4().hex[:8]}"
        now = datetime.utcnow()

        initial_event = {
            "id": f"evt-{uuid.uuid4().hex[:6]}",
            "incidentId": inc_id,
            "timestamp": now.isoformat(),
            "description": f"Incident reported: {payload.title}",
            "recordedBy": "Field Reporter",
            "type": "REPORTED"
        }

        population_weight = min(50.0, (payload.populationAffected or 0) / 100.0)
        severity_weight = 40.0 if payload.severity in ["CATASTROPHIC", "SEVERE"] else 20.0
        priority = round(min(100.0, population_weight + severity_weight + 10.0), 1)

        priority_factors = [
            f"Population exposed: {payload.populationAffected or 0}",
            f"Severity level: {payload.severity}",
            f"Road corridors impacted: {payload.roadsAffected or 0}"
        ]

        db_inc = IncidentModel(
            id=inc_id,
            title=payload.title,
            description=payload.description,
            severity=payload.severity,
            status="REPORTED",
            zone_id=payload.zoneId,
            coordinates_json=json.dumps(payload.coordinates),
            reported_at=now,
            population_affected=payload.populationAffected or 0,
            roads_affected=payload.roadsAffected or 0,
            priority_score=priority,
            priority_factors_json=json.dumps(priority_factors),
            timeline_json=json.dumps([initial_event]),
            assigned_resources_json=json.dumps([]),
            is_demo=True
        )
        db.add(db_inc)
        db.commit()
        db.refresh(db_inc)

        return self.get_incident(db, inc_id)  # type: ignore

    def transition_stage(self, db: Session, incident_id: str, new_stage: str, actor: str = "Command Officer") -> Tuple[Optional[IncidentSchema], Optional[str]]:
        inc = db.query(IncidentModel).filter(IncidentModel.id == incident_id).first()
        if not inc:
            return None, "Incident not found"

        stage_upper = new_stage.upper()
        if stage_upper not in VALID_STAGES:
            return None, f"Invalid stage: {new_stage}. Must be one of {VALID_STAGES}"

        if inc.status == "CLOSED" and stage_upper != "CLOSED":
            return None, "Cannot transition closed incident to another active stage"

        now = datetime.utcnow()
        inc.status = stage_upper
        if stage_upper == "VERIFIED":
            inc.verified_at = now
        elif stage_upper in ["DECLARED", "RESPONDING"]:
            inc.declared_at = now
        elif stage_upper == "CLOSED":
            inc.closed_at = now

        # Append timeline event
        timeline_raw = json.loads(inc.timeline_json) if inc.timeline_json else []
        timeline_raw.append({
            "id": f"evt-{uuid.uuid4().hex[:6]}",
            "incidentId": incident_id,
            "timestamp": now.isoformat(),
            "description": f"Incident transitioned to stage: {stage_upper}",
            "recordedBy": actor,
            "type": stage_upper
        })
        inc.timeline_json = json.dumps(timeline_raw)

        db.commit()
        db.refresh(inc)
        return self.get_incident(db, incident_id), None

incident_service = IncidentService()
