import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { CommandCentrePage } from '@/pages/CommandCentrePage';
import { RiskIntelligencePage } from '@/pages/RiskIntelligencePage';
import { IncidentsPage } from '@/pages/IncidentsPage';
import { IncidentDetailPage } from '@/pages/IncidentDetailPage';
import { FieldOperationsPage } from '@/pages/FieldOperationsPage';
import { ResponsePage } from '@/pages/ResponsePage';
import { EvacuationPage } from '@/pages/EvacuationPage';
import { SheltersPage } from '@/pages/SheltersPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { SimulationPage } from '@/pages/SimulationPage';
import { SystemPage } from '@/pages/SystemPage';
import { SettingsPage } from '@/pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/command" replace /> },
      { path: 'command', element: <CommandCentrePage /> },
      { path: 'risk', element: <RiskIntelligencePage /> },
      { path: 'incidents', element: <IncidentsPage /> },
      { path: 'incidents/:id', element: <IncidentDetailPage /> },
      { path: 'field', element: <FieldOperationsPage /> },
      { path: 'response', element: <ResponsePage /> },
      { path: 'evacuation', element: <EvacuationPage /> },
      { path: 'shelters', element: <SheltersPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'simulation', element: <SimulationPage /> },
      { path: 'system', element: <SystemPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);
