# Web admin mocks

- **`config.ts`** — `isMockApiMode()` reads `VITE_USE_MOCK_API` (see `.env.example`).
- **`webPreload.ts`** — builds Redux `preloadedState` from `@aj/mock-api` when mock mode is on.

Shared fixtures live in **`packages/mock-api`** so the same data can power web, mobile, Storybook, and tests.
