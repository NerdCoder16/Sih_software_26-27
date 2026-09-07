import json
from typing import List, Optional
from sqlalchemy.orm import Session
from app.db.models import ResourceModel, IncidentModel
from app.schemas.domain import ResourceSchema

class ResourceService:
    def get_resources(self, db: Session) -> List[ResourceSchema]:
        resources = db.query(ResourceModel).all()
        result = []
        for r in resources:
            loc = json.loads(r.location_json) if r.location_json else [0.0, 0.0]
            result.append(ResourceSchema(
                id=r.id,
                name=r.name,
                type=r.type,
                status=r.status,
                location=loc,
                assignedIncidentId=r.assigned_incident_id,
                capacity=r.capacity,
                eta=r.eta,
                district=r.district,
                contactPerson=r.contact_person,
                contactPhone=r.contact_phone,
                isDemo=r.is_demo
            ))
        return result

    def dispatch_resource(self, db: Session, resource_id: str, incident_id: str) -> Optional[ResourceSchema]:
        res = db.query(ResourceModel).filter(ResourceModel.id == resource_id).first()
        if not res:
            return None

        res.status = "DISPATCHED"
        res.assigned_incident_id = incident_id
        res.eta = 20  # estimated 20 min response time

        # Also update incident assigned resources list
        inc = db.query(IncidentModel).filter(IncidentModel.id == incident_id).first()
        if inc:
            assigned = json.loads(inc.assigned_resources_json) if inc.assigned_resources_json else []
            if resource_id not in assigned:
                assigned.append(resource_id)
                inc.assigned_resources_json = json.dumps(assigned)
            if inc.status in ["REPORTED", "VERIFIED"]:
                inc.status = "RESPONDING"

        db.commit()
        db.refresh(res)

        loc = json.loads(res.location_json) if res.location_json else [0.0, 0.0]
        return ResourceSchema(
            id=res.id,
            name=res.name,
            type=res.type,
            status=res.status,
            location=loc,
            assignedIncidentId=res.assigned_incident_id,
            capacity=res.capacity,
            eta=res.eta,
            district=res.district,
            contactPerson=res.contact_person,
            contactPhone=res.contact_phone,
            isDemo=res.is_demo
        )

resource_service = ResourceService()
