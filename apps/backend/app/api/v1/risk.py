from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import RiskZoneModel
from app.schemas.domain import ApiResponse, RiskZoneSchema, RiskFactorSchema
import json

router = APIRouter()

@router.get("", response_model=ApiResponse)
def get_risk_summary(db: Session = Depends(get_db)):
    zones = db.query(RiskZoneModel).all()
    max_zone = max(zones, key=lambda z: z.risk_score) if zones else None
    
    summary = {
        "highestRiskZone": max_zone.name if max_zone else "N/A",
        "highestRiskScore": max_zone.risk_score if max_zone else 0.0,
        "highestRiskLevel": max_zone.current_risk_level if max_zone else "SAFE",
        "totalZonesMonitored": len(zones),
        "criticalZonesCount": len([z for z in zones if z.current_risk_level == "CRITICAL"]),
        "highZonesCount": len([z for z in zones if z.current_risk_level == "HIGH"]),
        "source": "Deterministic Risk Engine & Multimodal Sensor Fusion"
    }

    return ApiResponse(success=True, data=summary)
