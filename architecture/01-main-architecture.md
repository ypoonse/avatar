# Main Architecture

## Overview
- Single-page React + TypeScript app bootstrapped with Vite.
- Three primary user flows: choose an animal, customize its traits, review/price/buy.
- State is kept lightweight and colocated in `App.tsx`; pages are dumb/presentational.

## Tech Stack
- Vite for build/dev (`npm run dev`, `npm run build`, `npm run preview`).
- React 18 with functional components and hooks.
- TypeScript with strict config; shared domain types live in `src/types.ts`.
- Styling: single global stylesheet `src/styles.css` (CSS modules could be added later).

## State & Data Model
- App-level state (`App.tsx`):
  - `step`: current screen (`choose` → `customize` → `review`).
  - `selectedAnimalId`: which base animal is active.
  - `configByAnimal`: per-animal avatar config so selections persist between animals.
- Domain types: `AnimalOption`, `ColorOption`, `PricedOption`, `AvatarConfig`.
- Option catalogs (animals, colors, eyes, body, tail, accessory) are simple arrays in `App.tsx`; can be moved to a data service or API call later.

## Component Structure
- `src/App.tsx`: orchestrates state, navigation, price calculation, and composes pages + preview.
- Pages (presentational):
  - `src/pages/ChooseAnimal.tsx`
  - `src/pages/CustomizeAvatar.tsx`
  - `src/pages/ReviewAvatar.tsx`
- Shared UI still in `App.tsx`:
  - `AvatarPreview` and `PriceLine` (can be moved to `src/components/` later).

## Data / UI Flow
1) **ChooseAnimal** receives `animals`, current selection, and `onSelect`.
2) **CustomizeAvatar** receives current `AvatarConfig`, change handler, and option catalogs; emits granular updates.
3) **ReviewAvatar** receives the chosen animal, config, pricing helpers, and option catalogs to render the summary table.
4) **AvatarPreview** mirrors the active config visually and is always visible in the side panel.
5) Pricing: `totalPrice = basePrice + sum(option deltas)` computed in `App.tsx`.

## Extensibility Notes
- Add API integration by replacing in-memory option arrays with fetch logic; keep the page props the same.
- If flows grow, introduce a router or a dedicated state store (Zustand/Redux) once cross-cutting concerns appear.
- Consider moving preview/pricing helpers into `src/components/` and extracting a `useAvatarPricing` hook for reuse.
- Tests: start with component tests per page plus a pricing utility test.

