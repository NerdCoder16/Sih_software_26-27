import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import RiskZoneModel, RiskHistoryModel
from app.schemas.domain import ApiResponse, RiskZoneSchema, RiskFactorSchema, RiskHistorySchema

router = APIRouter()

@router.get("", response_model=ApiResponse)
def get_zones(db: Session = Depends(get_db)):
    zones = db.query(RiskZoneModel).all()
    result = []
    for z in zones:
        coords = json.loads(z.coordinates_json) if z.coordinates_json else [0.0, 0.0]
        polygon = json.loads(z.polygon_json) if z.polygon_json else []
        factors_raw = json.loads(z.factors_json) if z.factors_json else []
        factors = [RiskFactorSchema(**f) for f in factors_raw]

        result.append(RiskZoneSchema(
            id=z.id,
            name=z.name,
            district=z.district,
            coordinates=coords,
            polygon=polygon,
            currentRiskLevel=z.current_risk_level,
            riskScore=z.risk_score,
            confidence=z.confidence,
            trend=z.trend,
            factors=factors,
            populationAtRisk=z.population_at_risk,
            roadsAtRisk=z.roads_at_risk,
            lastUpdated=z.last_updated,
            isDemo=z.is_demo
        ))
    return ApiResponse(success=True, data=result)

@router.get("/{zone_id}", response_model=ApiResponse)
def get_zone(zone_id: str, db: Session = Depends(get_db)):
    z = db.query(RiskZoneModel).filter(RiskZoneModel.id == zone_id).first()
    if not z:
        raise HTTPException(status_code=404, detail="Risk zone not found")

    coords = json.loads(z.coordinates_json) if z.coordinates_json else [0.0, 0.0]
    polygon = json.loads(z.polygon_json) if z.polygon_json else []
    factors_raw = json.loads(z.factors_json) if z.factors_json else []
    factors = [RiskFactorSchema(**f) for f in factors_raw]

    data = RiskZoneSchema(
        id=z.id,
        name=z.name,
        district=z.district,
        coordinates=coords,
        polygon=polygon,
        currentRiskLevel=z.current_risk_level,
        riskScore=z.risk_score,
        confidence=z.confidence,
        trend=z.trend,
        factors=factors,
        populationAtRisk=z.population_at_risk,
        roadsAtRisk=z.roads_at_risk,
        lastUpdated=z.last_updated,
        isDemo=z.is_demo
    )
    return ApiResponse(success=True, data=data)

@router.get("/{zone_id}/history", response_model=ApiResponse)
def get_zone_history(zone_id: str, db: Session = Depends(get_db)):
    history = db.query(RiskHistoryModel).filter(RiskHistoryModel.zone_id == zone_id).all()
    result = [
        RiskHistorySchema(
            zoneId=h.zone_id,
            timestamp=h.timestamp,
            riskScore=h.risk_score,
            riskLevel=h.risk_level
        ) for h in history
    ]
    return ApiResponse(success=True, data=result)
