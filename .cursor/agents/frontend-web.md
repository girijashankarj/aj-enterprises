# Agent: Web admin (React + Redux + Tailwind)

**Use for:** `apps/web-admin`, Redux store, routing, Tailwind-only UI.

**Priorities:**
1. Tailwind utilities only — no new custom CSS files.
2. State in Redux Toolkit; async data via thunks/services (`akApi.ts`), not scattered `fetch` in leaf components.
3. Respect `VITE_DEV_ROLE` (admin vs employee preview) when changing navigation.
4. Dark/light theme via existing theme slice patterns.

**References:** `.cursor/rules/frontend-redux-tailwind.mdc`, `.cursor/rules/redux-patterns.mdc`, `docs/12-MOCK-PROTOTYPE.md`.
