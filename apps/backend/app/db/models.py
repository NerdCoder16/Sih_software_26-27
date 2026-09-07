import json
from datetime import datetime
from typing import Optional, List, Any
from sqlalchemy import String, Float, Integer, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class RiskZoneModel(Base):
    __tablename__ = "risk_zones"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    district: Mapped[str] = mapped_column(String, nullable=False)
    coordinates_json: Mapped[str] = mapped_column(Text, default="[0.0, 0.0]")
    polygon_json: Mapped[str] = mapped_column(Text, default="[]")
    current_risk_level: Mapped[str] = mapped_column(String, default="SAFE")
    risk_score: Mapped[float] = mapped_column(Float, default=0.0)
    confidence: Mapped[float] = mapped_column(Float, default=90.0)
    trend: Mapped[str] = mapped_column(String, default="stable")
    factors_json: Mapped[str] = mapped_column(Text, default="[]")
    population_at_risk: Mapped[int] = mapped_column(Integer, default=0)
    roads_at_risk: Mapped[int] = mapped_column(Integer, default=0)
    last_updated: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True)

class RiskHistoryModel(Base):
    __tablename__ = "risk_history"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    zone_id: Mapped[str] = mapped_column(String, ForeignKey("risk_zones.id"), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    risk_score: Mapped[float] = mapped_column(Float, nullable=False)
    risk_level: Mapped[str] = mapped_column(String, nullable=False)

class SensorModel(Base):
    __tablename__ = "sensors"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    zone_id: Mapped[str] = mapped_column(String, ForeignKey("risk_zones.id"), nullable=False)
    type: Mapped[str] = mapped_column(String, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    coordinates_json: Mapped[str] = mapped_column(Text, default="[0.0, 0.0]")
    status: Mapped[str] = mapped_column(String, default="ACTIVE")
    installation_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    last_maintenance: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    battery_level: Mapped[float] = mapped_column(Float, default=100.0)
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True)

class SensorReadingModel(Base):
    __tablename__ = "sensor_readings"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    sensor_id: Mapped[str] = mapped_column(String, ForeignKey("sensors.id"), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    value: Mapped[float] = mapped_column(Float, nullable=False)
    unit: Mapped[str] = mapped_column(String, nullable=False)
    is_anomaly: Mapped[bool] = mapped_column(Boolean, default=False)
    quality: Mapped[float] = mapped_column(Float, default=1.0)

class AlertModel(Base):
    __tablename__ = "alerts"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, default="ACTIVE")
    zone_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    source: Mapped[str] = mapped_column(String, default="System Engine")
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    acknowledged_by: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    acknowledged_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    actions_json: Mapped[str] = mapped_column(Text, default="[]")
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True)

class IncidentModel(Base):
    __tablename__ = "incidents"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, default="REPORTED")
    zone_id: Mapped[str] = mapped_column(String, nullable=False)
    coordinates_json: Mapped[str] = mapped_column(Text, default="[0.0, 0.0]")
    reported_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    declared_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    closed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    casualties: Mapped[int] = mapped_column(Integer, default=0)
    injuries: Mapped[int] = mapped_column(Integer, default=0)
    structures_damaged: Mapped[int] = mapped_column(Integer, default=0)
    population_affected: Mapped[int] = mapped_column(Integer, default=0)
    roads_affected: Mapped[int] = mapped_column(Integer, default=0)
    priority_score: Mapped[float] = mapped_column(Float, default=50.0)
    priority_factors_json: Mapped[str] = mapped_column(Text, default="[]")
    timeline_json: Mapped[str] = mapped_column(Text, default="[]")
    assigned_resources_json: Mapped[str] = mapped_column(Text, default="[]")
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True)

class ResourceModel(Base):
    __tablename__ = "resources"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    type: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, default="AVAILABLE")
    location_json: Mapped[str] = mapped_column(Text, default="[0.0, 0.0]")
    assigned_incident_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    capacity: Mapped[int] = mapped_column(Integer, default=10)
    eta: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    district: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    contact_person: Mapped[str] = mapped_column(String, default="Command Dispatcher")
    contact_phone: Mapped[str] = mapped_column(String, default="+91-1070")
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True)

class ShelterModel(Base):
    __tablename__ = "shelters"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    district: Mapped[str] = mapped_column(String, nullable=False)
    coordinates_json: Mapped[str] = mapped_column(Text, default="[0.0, 0.0]")
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    current_occupancy: Mapped[int] = mapped_column(Integer, default=0)
    facilities_json: Mapped[str] = mapped_column(Text, default="[]")
    contact_person: Mapped[str] = mapped_column(String, default="Shelter Manager")
    contact_phone: Mapped[str] = mapped_column(String, default="+91-1070")
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True)

class EvacuationRouteModel(Base):
    __tablename__ = "evacuation_routes"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    origin_zone_id: Mapped[str] = mapped_column(String, nullable=False)
    destination_shelter_id: Mapped[str] = mapped_column(String, nullable=False)
    path_json: Mapped[str] = mapped_column(Text, default="[]")
    estimated_time_minutes: Mapped[int] = mapped_column(Integer, default=30)
    distance: Mapped[float] = mapped_column(Float, default=12.0)
    is_safe: Mapped[bool] = mapped_column(Boolean, default=True)
    status: Mapped[str] = mapped_column(String, default="active")
    risk_level: Mapped[str] = mapped_column(String, default="LOW")
    blockages_json: Mapped[str] = mapped_column(Text, default="[]")
    road_condition: Mapped[str] = mapped_column(String, default="Clear")
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True)

class FieldReportModel(Base):
    __tablename__ = "field_reports"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    incident_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    type: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    reported_by: Mapped[str] = mapped_column(String, nullable=False)
    coordinates_json: Mapped[str] = mapped_column(Text, default="[0.0, 0.0]")
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    severity: Mapped[int] = mapped_column(Integer, default=3)
    attachments_json: Mapped[str] = mapped_column(Text, default="[]")
    sync_status: Mapped[str] = mapped_column(String, default="SYNCED")
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True)

class RoadSegmentModel(Base):
    __tablename__ = "road_segments"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    highway_number: Mapped[str] = mapped_column(String, nullable=False)
    district: Mapped[str] = mapped_column(String, nullable=False)
    geometry_json: Mapped[str] = mapped_column(Text, default="[]")
    status: Mapped[str] = mapped_column(String, default="OPEN")
    risk_level: Mapped[str] = mapped_column(String, default="LOW")
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True)

class WeatherObservationModel(Base):
    __tablename__ = "weather_observations"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    district: Mapped[str] = mapped_column(String, nullable=False)
    station_name: Mapped[str] = mapped_column(String, nullable=False)
    rainfall_24h: Mapped[float] = mapped_column(Float, default=0.0)
    intensity: Mapped[float] = mapped_column(Float, default=0.0)
    humidity: Mapped[float] = mapped_column(Float, default=70.0)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    provider_mode: Mapped[str] = mapped_column(String, default="MOCK")

class SimulationRunModel(Base):
    __tablename__ = "simulation_runs"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    ended_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(String, default="COMPLETED")
    phase: Mapped[str] = mapped_column(String, default="NORMAL")
    elapsed_seconds: Mapped[int] = mapped_column(Integer, default=0)
    events_count: Mapped[int] = mapped_column(Integer, default=0)

class AuditEventModel(Base):
    __tablename__ = "audit_events"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    actor: Mapped[str] = mapped_column(String, nullable=False)
    action: Mapped[str] = mapped_column(String, nullable=False)
    entity_type: Mapped[str] = mapped_column(String, nullable=False)
    entity_id: Mapped[str] = mapped_column(String, nullable=False)
    details_json: Mapped[str] = mapped_column(Text, default="{}")
