# Frontend Architecture: NER Landslide EWRS

## 1. Tech Stack
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Data Fetching/Caching**: TanStack Query (React Query)
- **State Management**: Zustand
- **GIS/Mapping**: MapLibre GL JS
- **Charting**: ECharts
- **Animation**: Framer Motion

## 2. Directory Structure (`apps/web/src/`)
```
src/
├── assets/         # Static assets (images, icons)
├── components/     # Reusable UI components
│   ├── ui/         # Base design system components (buttons, inputs)
│   ├── map/        # MapLibre wrapper components
│   ├── charts/     # ECharts wrapper components
│   └── layout/     # Structural components (Navbar, Sidebar)
├── features/       # Feature-based modules (domain logic)
│   ├── alerts/
│   ├── evacuation/
│   ├── incidents/
│   ├── risk/
│   ├── sensors/
│   ├── simulation/
│   └── weather/
├── hooks/          # Global custom React hooks
├── lib/            # Utility functions and library configurations
├── providers/      # Context providers (Auth, Theme, Data)
├── routes/         # Route definitions and layouts
├── services/       # API clients and WebSocket managers
├── store/          # Zustand state slices
├── types/          # Global TypeScript interfaces
└── utils/          # Helper functions
```

## 3. Component Architecture
- **Pages**: Top-level route components, responsible for fetching data and passing it to feature components.
- **Layouts**: Wrap pages to provide common structure (e.g., DashboardLayout).
- **Features**: Domain-specific components handling business logic.
- **UI Components**: Dumb, reusable presentational components.

## 4. State Management Strategy (Zustand)
We use Zustand for global state that needs to be accessed across multiple feature silos. The state is divided into logical slices:
- `app`: Global UI state (theme, sidebar toggle, current mode: LIVE/DEMO).
- `risk`: Current risk assessment zones and levels.
- `sensor`: Real-time sensor readings and statuses.
- `weather`: Current and forecasted weather data.
- `incident`: Active landslide incidents and blockages.
- `alert`: System alerts and notifications.
- `field`: Field verification reports.
- `resource`: Dispatchable resources and teams.
- `evacuation`: Evacuation zone statuses.
- `simulation`: Demo simulation timeline and controls.
- `system`: System health and WebSocket connection status.

## 5. Data Provider Architecture
We implement an interface-driven approach for data services to seamlessly switch between Live, Mock, and Simulation data sources.
- `IDataService`: Base interface defining required methods (e.g., `getSensors()`, `subscribeToAlerts()`).
- `LiveDataProvider`: Connects to real backend via REST and WebSockets.
- `MockDataProvider`: Returns static mock data for UI development.
- `SimulationDataProvider`: Driven by the Simulation Engine, emitting time-series data for demo scenarios.

## 6. Routing Structure
- `/`: Dashboard Overview
- `/map`: Operational Map View
- `/sensors`: Sensor Network Health and Data
- `/risk`: Risk Analysis and AI Predictions
- `/incidents`: Incident Management
- `/resources`: Resource Allocation
- `/evacuation`: Evacuation Planning
- `/reports`: Field Reports
- `/settings`: System Settings

## 7. GIS/Map Architecture
- **Library**: MapLibre GL JS
- **Layers Management**: Layers are separated logically (Base map, Risk Zones, Sensor Points, Incidents, Evacuation Routes). We use a custom hook `useMapLayers` to toggle visibility based on global state.

## 8. WebSocket Integration Pattern
- A singleton `WebSocketManager` handles the connection.
- Components subscribe to specific channels (e.g., `sensor.reading`, `alert.created`) using custom hooks (`useWebSocket(channel, callback)`).
- See `WEBSOCKET_EVENTS.md` for payload structures.

## 9. Performance Considerations
- **Memoization**: `React.memo` for heavy map and chart components.
- **Selective Subscriptions**: Zustand allows components to subscribe only to specific state slices to prevent unnecessary re-renders.
- **Batching**: High-frequency WebSocket updates (like sensor readings) are debounced/batched before updating the React state.

## 10. i18n Architecture
- `react-i18next` for internationalization.
- Support for English, Hindi, and local NER languages.

## 11. Offline Support Architecture
- Service Workers cache static assets.
- Critical map tiles and current state are cached in IndexedDB for temporary offline continuity during network drops.

## 12. Error Boundary Strategy
- Global Error Boundary for the app root.
- Feature-level Error Boundaries to prevent a single widget failure from crashing the entire dashboard.

## 13. Operating Modes (LIVE vs DEMO)
The app runs in either LIVE mode (connecting to actual backend) or DEMO mode (driven by internal simulation engine for presentations). Mode is toggled via a hidden keyboard shortcut or settings panel.
