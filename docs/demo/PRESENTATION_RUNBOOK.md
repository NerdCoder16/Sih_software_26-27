# SIH Presentation Runbook

## Pre-Demo Setup
1. Ensure the application is built and running locally or on a stable staging server.
2. Ensure screen resolution is 1080p or higher.
3. Open the browser to the application URL in fullscreen mode (F11).
4. Verify you are logged in as an Administrator.

## Starting the Demo
1. Open the settings panel or use the secret keyboard shortcut (`Ctrl+Shift+D`) to toggle **DEMO MODE**.
2. A small simulation control widget will appear at the top of the screen.

## Narration Script & Timeline (5-8 Minutes)

### Phase 1: Introduction (1 min)
- **Action**: Show the default dashboard (NORMAL phase).
- **Talking Points**:
  - Explain the purpose of the Operational Command Centre.
  - Highlight the clean UI and overview metrics.
  - Point out the map focusing on the NER region (Nongstoin, Meghalaya).

### Phase 2: Warning Generation (1.5 mins)
- **Action**: Click "Start Simulation" on the widget. Simulation moves to PRE-WARNING.
- **Talking Points**:
  - "We are simulating a sudden heavy rainfall event."
  - Point to the weather widget updating.
  - Show how the AI model predicts risk, updating the map zones from Green to Yellow.
  - Highlight the incoming system alerts via WebSocket.

### Phase 3: Escalation (1.5 mins)
- **Action**: Simulation naturally progresses to ESCALATION.
- **Talking Points**:
  - Point to the sensor graphs spiking (soil moisture, inclinometer).
  - Show risk zones turning Red/Severe.
  - Explain how automated notifications are being generated for local authorities.

### Phase 4: Incident & Response (2 mins)
- **Action**: Simulation reaches INCIDENT phase.
- **Talking Points**:
  - A landslide incident appears on the map.
  - Show the Field Report arriving with a photo of a blocked road.
  - Demonstrate clicking on the incident to open the dispatch drawer.
  - Show assigning NDRF resources and heavy machinery to the site.

### Phase 5: Evacuation (1 min)
- **Action**: Trigger Evacuation mode via UI.
- **Talking Points**:
  - Show evacuation routes appearing on the map.
  - Highlight shelter capacity updating as the situation is managed.
  - Summarize how the system managed the entire lifecycle from prediction to response.

## Handling Questions
- **AI/ML Questions**: Refer to the predictive capabilities based on historical data + real-time sensors.
- **Hardware Integration**: Explain the IoT ingestion pipeline on the backend.
- **Scalability**: Mention the event-driven WebSocket architecture and cloud-native backend.

## Backup Plans
- If the simulation engine fails, have pre-recorded video snippets ready.
- Keep a local, static build of the app available in case of internet failure.
