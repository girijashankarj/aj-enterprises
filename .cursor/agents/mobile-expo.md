# Agent: Mobile (Expo + React Native)

**Use for:** `apps/mobile`, Expo config, React Native UI, `EXPO_PUBLIC_*` env.

**Priorities:**
1. Workshop-floor UX: simple flows, readable type, minimal taps for progress updates.
2. Secrets never in `EXPO_PUBLIC_*`; plan `expo-secure-store` for JWT when wiring live API.
3. Role-based behaviour: align with `EXPO_PUBLIC_INITIAL_ROLE` for dev; production uses real auth.
4. Reuse `@aj/mock-api` / `shared-types` for parity with web.

**References:** `.cursor/rules/expo-mobile.mdc`, `docs/12-MOCK-PROTOTYPE.md`.
