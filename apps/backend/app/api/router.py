from fastapi import APIRouter
from app.api.v1 import (
    zones,
    sensors,
    alerts,
    incidents,
    resources,
    shelters,
    evacuation,
    field_reports,
    health,
    simulation,
    weather,
    risk,
    system
)

api_router = APIRouter()

api_router.include_router(zones.router, prefix="/zones", tags=["Risk Zones"])
api_router.include_router(sensors.router, prefix="/sensors", tags=["Sensors"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["Alerts"])
api_router.include_router(incidents.router, prefix="/incidents", tags=["Incidents"])
api_router.include_router(resources.router, prefix="/resources", tags=["Resources"])
api_router.include_router(shelters.router, prefix="/shelters", tags=["Shelters"])
api_router.include_router(evacuation.router, prefix="/evacuation-routes", tags=["Evacuation"])
api_router.include_router(field_reports.router, prefix="/field-reports", tags=["Field Reports"])
api_router.include_router(health.router, prefix="/health", tags=["System Health"])
api_router.include_router(simulation.router, prefix="/simulation", tags=["Simulation Engine"])
api_router.include_router(weather.router, prefix="/weather", tags=["Weather Integration"])
api_router.include_router(risk.router, prefix="/risk", tags=["Risk Engine"])
api_router.include_router(system.router, prefix="/system", tags=["System Status"])
