import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging
from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.api.router import api_router
from app.realtime.manager import manager
from app.seed import seed_database

setup_logging()
logger = logging.getLogger("ner-backend.main")

# Auto-create database tables on startup
Base.metadata.create_all(bind=engine)

# Seed database with North Eastern Region data
db_session = SessionLocal()
try:
    seed_database(db_session)
finally:
    db_session.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="AI-Based Early Warning and Landslide Risk Monitoring Platform Backend for North Eastern Region (NER)"
)

# CORS configuration matching frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permissive CORS for development & demo flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "status": "ONLINE",
        "system": settings.PROJECT_NAME,
        "mode": settings.OPERATING_MODE,
        "docs": "/docs"
    }

# Real-Time WebSocket endpoint /ws/live
@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket, token: str = "demo-token"):
    await manager.connect(websocket)
    try:
        while True:
            # Keep-alive heartbeat listener
            data = await websocket.receive_text()
            logger.debug(f"Received WS message: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.warning(f"WebSocket error: {e}")
        manager.disconnect(websocket)
