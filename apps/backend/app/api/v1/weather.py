from fastapi import APIRouter
from app.schemas.domain import ApiResponse
from app.services.weather_service import weather_provider

router = APIRouter()

@router.get("", response_model=ApiResponse)
def get_weather(district: str = "East Khasi Hills"):
    obs = weather_provider.get_weather_observation(district)
    return ApiResponse(
        success=True,
        data=obs,
        message=f"Weather observation for {district} (Mode: {weather_provider.mode})"
    )
