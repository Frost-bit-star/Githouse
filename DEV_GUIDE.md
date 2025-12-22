# Developer Guide

This document outlines the key areas to extend or customize when building new features inside DevHub. It assumes you are already able to run the project via `npm run dev`.

## 1. Global Styling & Theme.

- **Tailwind classes** are applied directly within components. Stay consistent with the `brand-*` color tokens already used.
- **Theme toggle:** `components/Header.tsx` contains the sun/moon button. Persist theme choice by writing to `localStorage` and reading it during app load if you need state to survive refreshes.
- **Background animation:** `components/ParticleTextEffect.tsx` renders the animated canvas. Pass custom words or adjust opacity by editing the props provided from `App.tsx`.

## 2. Layout & Navigation

- The overall shell lives in `App.tsx`. Add new global overlays (e.g., modals, toasts) there so they sit above main content but below the header.
- `components/Sidebar.tsx` defines navigation items. Follow the existing data structure (label, icon, count) when adding new entries.

## 3. Data & State

- Mock data is centralized in `constants.ts`. Replace individual sections with real API calls by moving the logic into dedicated hooks and importing them where widgets render.
- Authentication state uses `Zustand` via `store/useHubStore.ts`. Add new global flags/selectors there for features that need cross-component coordination.

## 4. Adding New Widgets/Modules

1. Create a new component under `components/`.
2. Add any local mock data or hook imports at the top of the file.
3. Register the component inside `App.tsx` within the grid layout (or wherever it should appear).
4. Keep components presentational when possible. Use hooks/services for business logic.

## 5. Working With Assets

- Static images are imported from `components/assets`. Drag in new files and import them locally within the component that uses them (Vite handles bundling).
- For SVG icons, follow the pattern in `components/icons/` by exporting a typed React FC.

## 6. Environment Variables

- Declare new variables in `env.d.ts` for TypeScript awareness.
- Access them through `import.meta.env.VITE_YOUR_KEY` and document usage in the README.

## 7. Testing & Validation

- While the project currently has no automated tests, consider adding component-level tests with React Testing Library for new critical features.
- Use the browser console and Vite HMR output for quick validation during development.

## 8. Contribution Checklist

- Update screenshots or documentation if your change alters visual output.
- Keep imports sorted and remove unused ones to avoid TS lint warnings.
- Run `npm run build` before opening a PR to ensure the production build passes.

Happy hacking! 🦎
