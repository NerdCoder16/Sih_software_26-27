from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.domain import ApiResponse
from app.services.simulation_service import backend_simulation_engine
from app.core.config import settings

router = APIRouter()

@router.get("", response_model=ApiResponse)
def get_system_status(db: Session = Depends(get_db)):
    status_data = {
        "operatingMode": settings.OPERATING_MODE,
        "weatherProviderMode": settings.WEATHER_PROVIDER,
        "environment": settings.ENVIRONMENT,
        "databaseEngine": "SQLite / PostgreSQL",
        "simulationState": backend_simulation_engine.get_state(),
        "isHealthy": True
    }
    return ApiResponse(success=True, data=status_data)
