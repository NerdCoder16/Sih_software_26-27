# SIH Demonstration Guide — End-to-End Walkthrough

Follow these steps to present the **Smart India Hackathon POC**:

1. **Launch Command Centre**: Open `http://localhost:5173/command`. Ensure top header badge indicates `DEMO MODE (SIMULATED DATA)`.
2. **Inspect Normal Baseline**: Note stable risk scores across North Eastern Region zones (Sohra, Ri-Bhoi, Mawsynram, Kohima, Aizawl).
3. **Navigate to Simulation Page**: Open `/simulation`.
4. **Trigger Heavy Rainfall Scenario**: Click **Play** or click **Next Phase** to advance from `NORMAL` → `HEAVY_RAIN` → `SOIL_SATURATION` → `SLOPE_MOVEMENT` → `IMMINENT_LANDSLIDE`.
5. **Observe Real-Time Risk Escalation**:
   - Telemetry rises in real time.
   - Risk Engine evaluates risk score (89/100 `CRITICAL`).
   - Risk map highlights red perimeter over Sohra-Cherrapunji.
   - Threshold engine automatically broadcasts `CRITICAL: Imminent Slope Failure` alert.
6. **Incident Declaration & Dispatch**:
   - Incident `Major Landslide at Sohra` created.
   - Dispatch SDRF Team Alpha and Heavy Excavator via `/response`.
   - View evacuation route status & shelter capacity on `/shelters` and `/evacuation`.
7. **Complete Scenario**: Transition through `LANDSLIDE_OCCURRED` → `RECOVERY` to demonstrate full disaster response lifecycle.
