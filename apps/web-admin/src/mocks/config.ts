/**
 * Prototype mode: UI reads from `@aj/mock-api` fixtures instead of Postgres/API.
 * Set `VITE_USE_MOCK_API=false` when pointing the app at a real backend.
 */
export function isMockApiMode(): boolean {
  return import.meta.env.VITE_USE_MOCK_API !== "false";
}
