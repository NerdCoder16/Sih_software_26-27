# NER Landslide Early Warning & Response System

> AI-Based Early Warning and Landslide Risk Monitoring System for the North Eastern Region of India

[![Smart India Hackathon](https://img.shields.io/badge/SIH-2026-blue.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)]()
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)]()
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff.svg)]()

## Overview

A real-time disaster intelligence platform combining AI-powered risk assessment, GIS command centre visualization, field verification, incident management, and digital twin simulation for landslide monitoring across India's North Eastern Region.

### Operational Lifecycle

```
SENSE → INGEST → VALIDATE → ANALYSE → PREDICT → WARN → VERIFY → DECLARE
→ PRIORITISE → DISPATCH → EVACUATE → RESCUE → RECOVER → LEARN
```

## Architecture

```
ner-landslide-ewrs/
├── apps/
│   ├── web/              # React frontend application
│   └── backend/          # Node.js backend (Phase 2)
├── packages/
│   ├── shared-types/     # TypeScript type definitions
│   ├── api-contracts/    # API endpoint contracts
│   ├── config/           # Shared configuration
│   └── design-tokens/    # Design system tokens
├── docs/                 # Project documentation
├── tests/                # Integration & E2E tests
└── scripts/              # Build & utility scripts
```

## Quick Start

### Prerequisites

- Node.js >= 20.x
- npm >= 10.x

### Installation

```bash
cd apps/web
npm install
```

### Development

```bash
cd apps/web
npm run dev
```

The application will start at `http://localhost:5173`

### Build

```bash
cd apps/web
npm run build
```

## Operating Modes

### LIVE Mode
Connects to real backend APIs, sensors, and external data sources. Shows actual risk assessments with full data provenance (source, timestamp, confidence, freshness).

### DEMO Mode
Runs a deterministic digital twin simulation demonstrating the complete disaster lifecycle from normal conditions through landslide event to recovery. Uses the same frontend contracts and state management as live mode.

## Key Features

- **GIS Command Centre** — Map-first operational dashboard with multi-layer risk visualization
- **AI Risk Intelligence** — Explainable risk scoring with factor analysis and confidence tracking
- **Real-time Alerts** — Multi-severity alert system with acknowledgement workflow
- **Incident Management** — Full lifecycle from detection to closure
- **Field Operations** — Mobile-first field reporting with GPS, media capture, offline support
- **Response Coordination** — Resource dispatch and tracking
- **Evacuation Management** — Route planning with shelter capacity tracking
- **Digital Twin Simulation** — 5-8 minute demo scenario with realistic NER data
- **System Health** — Service status monitoring with degradation handling

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| State | Zustand |
| Data Fetching | TanStack Query |
| Maps | MapLibre GL JS |
| Charts | ECharts |
| Animation | Framer Motion |
| Validation | Zod |
| Icons | Lucide React |

## Documentation

- [Frontend Architecture](docs/architecture/FRONTEND_ARCHITECTURE.md)
- [API Contracts](docs/api/API_CONTRACT.md)
- [WebSocket Events](docs/api/WEBSOCKET_EVENTS.md)
- [Design System](docs/ui/DESIGN_SYSTEM.md)
- [Simulation Contract](docs/simulation/SIMULATION_CONTRACT.md)
- [Backend Integration Guide](docs/integration/BACKEND_INTEGRATION.md)
- [Presentation Runbook](docs/demo/PRESENTATION_RUNBOOK.md)

## License

This project is developed for the Smart India Hackathon 2026.
