# Mobile mocks

- **`config.ts`** — `isMockApiMode()` reads `EXPO_PUBLIC_USE_MOCK_API` (see `.env.example`).
- Store `preloadedState` in `App.tsx` is filled from `getMobileMockBootstrap()` when mock mode is on.

Shared fixtures: **`packages/mock-api`**.
