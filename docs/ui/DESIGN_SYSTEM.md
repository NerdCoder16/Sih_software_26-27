# Design System

## 1. Design Philosophy
The UI follows an **Operational Command Centre Aesthetic**. It must be highly legible, dense with information, and immediately draw attention to critical events.

## 2. Color System (Dark Theme Default)
- **Background**: Very dark slate (`#0F172A`)
- **Panels**: Dark slate (`#1E293B`)
- **Text Primary**: White (`#F8FAFC`)
- **Text Secondary**: Slate gray (`#94A3B8`)
- **Risk Levels / Statuses**:
  - `NORMAL`: Green (`#10B981`)
  - `MODERATE`: Yellow (`#F59E0B`)
  - `HIGH`: Orange (`#F97316`)
  - `SEVERE`: Red (`#EF4444`)
  - `CRITICAL`: Crimson (`#DC2626`) with pulsing animation.

## 3. Typography
- **Font Family**: Inter
- **Scale**:
  - H1: 24px (Bold)
  - H2: 20px (Semibold)
  - Body: 14px (Regular)
  - Small/Metadata: 12px (Regular)

## 4. Spacing System
Based on a 4px grid.
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px

## 5. Component Catalog
- **Buttons**: Primary (Brand Blue), Destructive (Red), Outline.
- **Cards**: Slightly rounded corners (`rounded-lg`), subtle borders (`border-slate-700`).
- **Badges**: Pill-shaped, used for statuses (e.g., Active, Resolved).
- **Tables**: Dense formatting, sticky headers.
- **Modals/Drawers**: Used for deep-dives (e.g., specific incident details) without losing context of the dashboard.

## 6. Map Styling
- Dark mode vector tiles (MapLibre).
- Clean topography lines.
- Risk zones use semi-transparent polygon fills matching the Risk Level colors.

## 7. Chart Styling (ECharts)
- Grid lines must be subtle (`#334155`).
- Tooltips must be fast and high contrast.
- Line charts use smooth curves.

## 8. Icons
- Library: **Lucide React**.
- Standard size: 16px or 20px.

## 9. Animations (Framer Motion)
- **Transitions**: Fast (150-200ms).
- **Alerts**: Severe alerts use a subtle, continuous pulse effect on their border/icon.

## 10. Responsive Breakpoints
- Mobile: `< 768px` (Stack panels)
- Tablet: `768px - 1024px`
- Desktop: `> 1024px` (Command center layout, sidebar + map + side panel)

## 11. Accessibility
- All critical status colors must also have an associated icon or text label for colorblind users.
- ARIA labels on all interactive map elements.
