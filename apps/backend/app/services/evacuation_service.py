import json
from typing import List, Optional
from sqlalchemy.orm import Session
from app.db.models import ShelterModel, EvacuationRouteModel
from app.schemas.domain import ShelterSchema, EvacuationRouteSchema

class EvacuationService:
    def get_shelters(self, db: Session) -> List[ShelterSchema]:
        shelters = db.query(ShelterModel).all()
        result = []
        for s in shelters:
            coords = json.loads(s.coordinates_json) if s.coordinates_json else [0.0, 0.0]
            facilities = json.loads(s.facilities_json) if s.facilities_json else []
            avail = max(0, s.capacity - s.current_occupancy)

            result.append(ShelterSchema(
                id=s.id,
                name=s.name,
                district=s.district,
                coordinates=coords,
                capacity=s.capacity,
                currentOccupancy=s.current_occupancy,
                availableCapacity=avail,
                facilities=facilities,
                contactPerson=s.contact_person,
                contactPhone=s.contact_phone,
                isDemo=s.is_demo
            ))
        return result

    def get_routes(self, db: Session) -> List[EvacuationRouteSchema]:
        routes = db.query(EvacuationRouteModel).all()
        result = []
        for r in routes:
            path = json.loads(r.path_json) if r.path_json else []
            blockages = json.loads(r.blockages_json) if r.blockages_json else []

            result.append(EvacuationRouteSchema(
                id=r.id,
                name=r.name,
                originZoneId=r.origin_zone_id,
                destinationShelterId=r.destination_shelter_id,
                path=path,
                estimatedTimeMinutes=r.estimated_time_minutes,
                distance=r.distance,
                isSafe=r.is_safe,
                status=r.status,
                riskLevel=r.risk_level,
                blockages=blockages,
                roadCondition=r.road_condition,
                isDemo=r.is_demo
            ))
        return result

evacuation_service = EvacuationService()
