from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.domain import ApiResponse
from app.services.evacuation_service import evacuation_service

router = APIRouter()

@router.get("", response_model=ApiResponse)
def get_shelters(db: Session = Depends(get_db)):
    shelters = evacuation_service.get_shelters(db)
    return ApiResponse(success=True, data=shelters)
