import json
import uuid
from datetime import datetime, timedelta
from typing import List, Optional
from sqlalchemy.orm import Session
from app.db.models import AlertModel
from app.schemas.domain import AlertSchema

class AlertService:
    def get_alerts(self, db: Session) -> List[AlertSchema]:
        alerts = db.query(AlertModel).all()
        result = []
        for a in alerts:
            actions = json.loads(a.actions_json) if a.actions_json else []
            result.append(AlertSchema(
                id=a.id,
                title=a.title,
                description=a.description,
                severity=a.severity,
                status=a.status,
                zoneId=a.zone_id,
                source=a.source,
                timestamp=a.timestamp,
                expiresAt=a.expires_at,
                acknowledgedBy=a.acknowledged_by,
                acknowledgedAt=a.acknowledged_at,
                actions=actions,
                isDemo=a.is_demo
            ))
        return result

    def acknowledge_alert(self, db: Session, alert_id: str, actor: str = "District Officer") -> Optional[AlertSchema]:
        alert = db.query(AlertModel).filter(AlertModel.id == alert_id).first()
        if not alert:
            return None
        
        alert.status = "ACKNOWLEDGED"
        alert.acknowledged_by = actor
        alert.acknowledged_at = datetime.utcnow()
        db.commit()
        db.refresh(alert)

        actions = json.loads(alert.actions_json) if alert.actions_json else []
        return AlertSchema(
            id=alert.id,
            title=alert.title,
            description=alert.description,
            severity=alert.severity,
            status=alert.status,
            zoneId=alert.zone_id,
            source=alert.source,
            timestamp=alert.timestamp,
            expiresAt=alert.expires_at,
            acknowledgedBy=alert.acknowledged_by,
            acknowledgedAt=alert.acknowledged_at,
            actions=actions,
            isDemo=alert.is_demo
        )

    def create_threshold_alert(self, db: Session, zone_id: str, zone_name: str, risk_level: str, risk_score: float) -> Optional[AlertSchema]:
        # Cooldown check: avoid alert spam within 10 minutes for same zone & severity
        ten_mins_ago = datetime.utcnow() - timedelta(minutes=10)
        recent = db.query(AlertModel).filter(
            AlertModel.zone_id == zone_id,
            AlertModel.severity == risk_level,
            AlertModel.timestamp >= ten_mins_ago
        ).first()

        if recent:
            return None

        alert_id = f"alt-{uuid.uuid4().hex[:8]}"
        title = f"CRITICAL RISK: {zone_name}" if risk_level == "CRITICAL" else f"HIGH RISK: {zone_name}"
        description = f"Landslide susceptibility threshold crossed for {zone_name}. Current score: {risk_score}/100. Emergency protocols activated."
        
        actions = ["Evacuate High-Risk Sectors", "Dispatch Ground Recon", "Broadcast IVR Alert"] if risk_level == "CRITICAL" else ["Monitor Sensors", "Alert Local NDRF"]

        db_alert = AlertModel(
            id=alert_id,
            title=title,
            description=description,
            severity=risk_level,
            status="ACTIVE",
            zone_id=zone_id,
            source="Risk Threshold Engine",
            timestamp=datetime.utcnow(),
            expires_at=datetime.utcnow() + timedelta(hours=6),
            actions_json=json.dumps(actions),
            is_demo=True
        )
        db.add(db_alert)
        db.commit()
        db.refresh(db_alert)

        return AlertSchema(
            id=db_alert.id,
            title=db_alert.title,
            description=db_alert.description,
            severity=db_alert.severity,
            status=db_alert.status,
            zoneId=db_alert.zone_id,
            source=db_alert.source,
            timestamp=db_alert.timestamp,
            expiresAt=db_alert.expires_at,
            actions=actions,
            isDemo=db_alert.is_demo
        )

alert_service = AlertService()
