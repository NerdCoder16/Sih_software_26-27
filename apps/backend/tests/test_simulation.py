import pytest
from app.services.simulation_service import backend_simulation_engine

def test_simulation_lifecycle():
    backend_simulation_engine.reset()
    state = backend_simulation_engine.get_state()
    assert state["isActive"] is False
    assert state["phase"] == "NORMAL"

    backend_simulation_engine.start()
    state = backend_simulation_engine.get_state()
    assert state["isActive"] is True

    backend_simulation_engine.set_speed(10)
    backend_simulation_engine.advance_phase("HEAVY_RAIN")
    state = backend_simulation_engine.get_state()
    assert state["phase"] == "HEAVY_RAIN"
    assert state["speed"] == 10

    backend_simulation_engine.reset()
    state = backend_simulation_engine.get_state()
    assert state["isActive"] is False
    assert state["phase"] == "NORMAL"
