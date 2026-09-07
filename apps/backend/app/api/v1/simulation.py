from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
from app.schemas.domain import ApiResponse
from app.services.simulation_service import backend_simulation_engine
from app.realtime.manager import manager

router = APIRouter()

class SimulationControlPayload(BaseModel):
    action: str  # START | PAUSE | RESUME | RESET | STEP | SET_SPEED | SET_PHASE
    speed: Optional[int] = 1
    phase: Optional[str] = "NORMAL"

@router.get("/state", response_model=ApiResponse)
def get_simulation_state():
    state = backend_simulation_engine.get_state()
    return ApiResponse(success=True, data=state)

@router.post("/control", response_model=ApiResponse)
async def control_simulation(
    payload: SimulationControlPayload,
    background_tasks: BackgroundTasks
):
    act = payload.action.upper()
    if act == "START":
        backend_simulation_engine.start()
    elif act == "PAUSE":
        backend_simulation_engine.pause()
    elif act == "RESUME":
        backend_simulation_engine.resume()
    elif act == "RESET":
        backend_simulation_engine.reset()
    elif act == "SET_SPEED":
        if payload.speed:
            backend_simulation_engine.set_speed(payload.speed)
    elif act == "SET_PHASE":
        if payload.phase:
            backend_simulation_engine.advance_phase(payload.phase)
    elif act == "STEP":
        backend_simulation_engine.tick()

    state = backend_simulation_engine.get_state()
    background_tasks.add_task(manager.broadcast, "SIMULATION_PHASE_CHANGED", state)
    background_tasks.add_task(manager.broadcast, "SIMULATION_UPDATED", state)

    return ApiResponse(success=True, data=state, message=f"Simulation control executed: {act}")

@router.post("/start", response_model=ApiResponse)
async def start_simulation(background_tasks: BackgroundTasks):
    backend_simulation_engine.start()
    state = backend_simulation_engine.get_state()
    background_tasks.add_task(manager.broadcast, "SIMULATION_UPDATED", state)
    return ApiResponse(success=True, data=state, message="Simulation started")

@router.post("/pause", response_model=ApiResponse)
async def pause_simulation(background_tasks: BackgroundTasks):
    backend_simulation_engine.pause()
    state = backend_simulation_engine.get_state()
    background_tasks.add_task(manager.broadcast, "SIMULATION_UPDATED", state)
    return ApiResponse(success=True, data=state, message="Simulation paused")

@router.post("/reset", response_model=ApiResponse)
async def reset_simulation(background_tasks: BackgroundTasks):
    backend_simulation_engine.reset()
    state = backend_simulation_engine.get_state()
    background_tasks.add_task(manager.broadcast, "SIMULATION_UPDATED", state)
    return ApiResponse(success=True, data=state, message="Simulation reset")

@router.post("/next", response_model=ApiResponse)
async def next_simulation_phase(background_tasks: BackgroundTasks):
    from app.services.simulation_service import PHASES
    curr = backend_simulation_engine.phase
    idx = PHASES.index(curr) if curr in PHASES else 0
    next_phase = PHASES[(idx + 1) % len(PHASES)]
    backend_simulation_engine.advance_phase(next_phase)
    state = backend_simulation_engine.get_state()
    background_tasks.add_task(manager.broadcast, "SIMULATION_UPDATED", state)
    return ApiResponse(success=True, data=state, message=f"Simulation advanced to {next_phase}")
