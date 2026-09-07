import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.db.models import (
    RiskZoneModel, SensorModel, SensorReadingModel,
    AlertModel, IncidentModel, ResourceModel,
    ShelterModel, EvacuationRouteModel
)

def seed_database(db: Session):
    if db.query(RiskZoneModel).first():
        return  # Database already seeded

    now = datetime.utcnow()

    # 1. SEED RISK ZONES
    zones = [
        RiskZoneModel(
            id="z1",
            name="Sohra-Cherrapunji Slope Zone",
            district="East Khasi Hills",
            coordinates_json=json.dumps([91.7333, 25.2667]),
            polygon_json=json.dumps([[91.70, 25.23], [91.77, 25.23], [91.77, 25.30], [91.70, 25.30], [91.70, 25.23]]),
            current_risk_level="CRITICAL",
            risk_score=89.0,
            confidence=94.0,
            trend="rising",
            factors_json=json.dumps([
                {"type": "Rainfall Intensity", "value": 185, "threshold": 100, "contribution": 35},
                {"type": "Soil Saturation", "value": 92, "threshold": 85, "contribution": 30},
                {"type": "Slope Gradient", "value": 42, "threshold": 30, "contribution": 20},
                {"type": "Historical Susceptibility", "value": 8.5, "threshold": 5, "contribution": 15}
            ]),
            population_at_risk=14500,
            roads_at_risk=2,
            last_updated=now,
            is_demo=True
        ),
        RiskZoneModel(
            id="z2",
            name="NH-40 Highway Corridor",
            district="Ri-Bhoi",
            coordinates_json=json.dumps([91.8667, 25.9000]),
            polygon_json=json.dumps([[91.82, 25.85], [91.92, 25.85], [91.92, 25.95], [91.82, 25.95], [91.82, 25.85]]),
            current_risk_level="HIGH",
            risk_score=76.0,
            confidence=91.0,
            trend="rising",
            factors_json=json.dumps([
                {"type": "Rainfall Intensity", "value": 142, "threshold": 100, "contribution": 40},
                {"type": "Geological Weakness", "value": 7.2, "threshold": 5, "contribution": 30},
                {"type": "Vegetation Loss", "value": 28, "threshold": 20, "contribution": 20}
            ]),
            population_at_risk=22000,
            roads_at_risk=1,
            last_updated=now,
            is_demo=True
        ),
        RiskZoneModel(
            id="z3",
            name="Mawsynram Ridge",
            district="East Khasi Hills",
            coordinates_json=json.dumps([91.5833, 25.3000]),
            polygon_json=json.dumps([[91.55, 25.27], [91.62, 25.27], [91.62, 25.33], [91.55, 25.33], [91.55, 25.27]]),
            current_risk_level="HIGH",
            risk_score=71.0,
            confidence=88.0,
            trend="stable",
            factors_json=json.dumps([
                {"type": "Rainfall Intensity", "value": 160, "threshold": 100, "contribution": 45},
                {"type": "Soil Saturation", "value": 88, "threshold": 85, "contribution": 35}
            ]),
            population_at_risk=9800,
            roads_at_risk=1,
            last_updated=now,
            is_demo=True
        ),
        RiskZoneModel(
            id="z4",
            name="Kohima Urban Slopes",
            district="Kohima",
            coordinates_json=json.dumps([94.1086, 25.6751]),
            polygon_json=json.dumps([[94.07, 25.64], [94.14, 25.64], [94.14, 25.71], [94.07, 25.71], [94.07, 25.64]]),
            current_risk_level="CRITICAL",
            risk_score=85.0,
            confidence=95.0,
            trend="rising",
            factors_json=json.dumps([
                {"type": "Slope Movement", "value": 18, "threshold": 10, "contribution": 40},
                {"type": "Urban Drainage Failure", "value": 85, "threshold": 50, "contribution": 35}
            ]),
            population_at_risk=35000,
            roads_at_risk=3,
            last_updated=now,
            is_demo=True
        ),
        RiskZoneModel(
            id="z5",
            name="Aizawl North Ridge",
            district="Aizawl",
            coordinates_json=json.dumps([92.7176, 23.7307]),
            polygon_json=json.dumps([[92.68, 23.70], [92.75, 23.70], [92.75, 23.76], [92.68, 23.76], [92.68, 23.70]]),
            current_risk_level="MODERATE",
            risk_score=52.0,
            confidence=85.0,
            trend="stable",
            factors_json=json.dumps([
                {"type": "Soil Saturation", "value": 65, "threshold": 80, "contribution": 50}
            ]),
            population_at_risk=18000,
            roads_at_risk=1,
            last_updated=now,
            is_demo=True
        )
    ]
    db.add_all(zones)

    # 2. SEED SENSORS
    sensors = [
        SensorModel(
            id="s1",
            zone_id="z1",
            type="INCLINOMETER",
            name="INC-Sohra-01",
            coordinates_json=json.dumps([91.7340, 25.2670]),
            status="ACTIVE",
            installation_date=now - timedelta(days=365),
            battery_level=92.0,
            is_demo=True
        ),
        SensorModel(
            id="s2",
            zone_id="z1",
            type="SOIL_MOISTURE",
            name="SMS-Sohra-02",
            coordinates_json=json.dumps([91.7325, 25.2660]),
            status="ACTIVE",
            installation_date=now - timedelta(days=300),
            battery_level=88.0,
            is_demo=True
        ),
        SensorModel(
            id="s3",
            zone_id="z2",
            type="RAIN_GAUGE",
            name="RG-RiBhoi-01",
            coordinates_json=json.dumps([91.8670, 25.9010]),
            status="ACTIVE",
            installation_date=now - timedelta(days=200),
            battery_level=95.0,
            is_demo=True
        )
    ]
    db.add_all(sensors)

    # 3. SEED ALERTS
    alerts = [
        AlertModel(
            id="alt-1",
            title="CRITICAL: High Slope Displacement",
            description="Inclinometer INC-Sohra-01 recorded 18mm cumulative tilt along Sohra slope.",
            severity="CRITICAL",
            status="ACTIVE",
            zone_id="z1",
            source="Automated Sensor Engine",
            timestamp=now - timedelta(minutes=15),
            actions_json=json.dumps(["Evacuate Sector A", "Dispatch SDRF Team 1"]),
            is_demo=True
        ),
        AlertModel(
            id="alt-2",
            title="WARNING: Heavy Rainfall Threshold Crossed",
            description="NH-40 Corridor recorded 142mm rain in 24 hours.",
            severity="WARNING",
            status="ACTIVE",
            zone_id="z2",
            source="Weather Station Integration",
            timestamp=now - timedelta(minutes=45),
            actions_json=json.dumps(["Issue Road Warning", "Inspect Highway Cut"]),
            is_demo=True
        )
    ]
    db.add_all(alerts)

    # 4. SEED INCIDENTS
    incidents = [
        IncidentModel(
            id="inc-1",
            title="Landslide Blockage on NH-40 Corridor",
            description="Debris slump of ~300 cubic meters blocked both lanes of NH-40 near Nongpoh.",
            severity="MAJOR",
            status="RESPONDING",
            zone_id="z2",
            coordinates_json=json.dumps([91.8667, 25.9000]),
            reported_at=now - timedelta(hours=2),
            casualties=0,
            injuries=2,
            structures_damaged=1,
            population_affected=1200,
            roads_affected=1,
            priority_score=78.5,
            priority_factors_json=json.dumps(["Major NH-40 highway blocked", "Injuries reported: 2"]),
            timeline_json=json.dumps([
                {"id": "evt-1", "incidentId": "inc-1", "timestamp": (now - timedelta(hours=2)).isoformat(), "description": "Landslide reported by Highway Patrol", "recordedBy": "Police Control Room", "type": "REPORTED"},
                {"id": "evt-2", "incidentId": "inc-1", "timestamp": (now - timedelta(hours=1, minutes=30)).isoformat(), "description": "Verified by District Magistrate", "recordedBy": "DM Ri-Bhoi", "type": "VERIFIED"}
            ]),
            assigned_resources_json=json.dumps(["res-1", "res-2"]),
            is_demo=True
        )
    ]
    db.add_all(incidents)

    # 5. SEED RESOURCES
    resources = [
        ResourceModel(
            id="res-1",
            name="SDRF Team Alpha (Shillong)",
            type="SDRF",
            status="DISPATCHED",
            location_json=json.dumps([91.8833, 25.5667]),
            assigned_incident_id="inc-1",
            capacity=25,
            eta=15,
            district="East Khasi Hills",
            contact_person="Capt. R. Sangma",
            contact_phone="+91-9436100001",
            is_demo=True
        ),
        ResourceModel(
            id="res-2",
            name="Heavy Excavator Unit 04",
            type="HEAVY_MACHINERY",
            status="DISPATCHED",
            location_json=json.dumps([91.8667, 25.9000]),
            assigned_incident_id="inc-1",
            capacity=1,
            eta=10,
            district="Ri-Bhoi",
            contact_person="Eng. T. Lyngdoh",
            contact_phone="+91-9436100002",
            is_demo=True
        ),
        ResourceModel(
            id="res-3",
            name="Medical Emergency Team 1",
            type="MEDICAL_TEAM",
            status="AVAILABLE",
            location_json=json.dumps([91.7333, 25.2667]),
            capacity=10,
            district="East Khasi Hills",
            contact_person="Dr. K. Dkhar",
            contact_phone="+91-9436100003",
            is_demo=True
        )
    ]
    db.add_all(resources)

    # 6. SEED SHELTERS
    shelters = [
        ShelterModel(
            id="sh-1",
            name="Sohra Community Hall & Relief Shelter",
            district="East Khasi Hills",
            coordinates_json=json.dumps([91.7350, 25.2700]),
            capacity=500,
            current_occupancy=145,
            facilities_json=json.dumps(["Medical Support", "Food Kitchen", "Clean Water", "Backup Generator"]),
            contact_person="Officer P. Syiem",
            contact_phone="+91-9436100010",
            is_demo=True
        ),
        ShelterModel(
            id="sh-2",
            name="Nongpoh Multi-Purpose Cyclone Shelter",
            district="Ri-Bhoi",
            coordinates_json=json.dumps([91.8800, 25.9100]),
            capacity=800,
            current_occupancy=220,
            facilities_json=json.dumps(["Medical Bay", "Sanitation", "Helipad Nearby"]),
            contact_person="Officer M. Marak",
            contact_phone="+91-9436100011",
            is_demo=True
        )
    ]
    db.add_all(shelters)

    # 7. SEED EVACUATION ROUTES
    routes = [
        EvacuationRouteModel(
            id="ev-1",
            name="Sohra Slope Evacuation Route A",
            origin_zone_id="z1",
            destination_shelter_id="sh-1",
            path_json=json.dumps([[91.7333, 25.2667], [91.7340, 25.2680], [91.7350, 25.2700]]),
            estimated_time_minutes=15,
            distance=3.5,
            is_safe=True,
            status="active",
            risk_level="LOW",
            blockages_json=json.dumps([]),
            road_condition="Clear",
            is_demo=True
        )
    ]
    db.add_all(routes)

    db.commit()
    print("[Seed] Successfully seeded North Eastern Region database with 5 zones, 3 sensors, alerts, incidents, resources, shelters & evacuation routes.")
