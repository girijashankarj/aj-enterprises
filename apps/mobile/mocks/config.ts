/**
 * Prototype: load fixtures from `@aj/mock-api`.
 * Set `EXPO_PUBLIC_USE_MOCK_API=false` when the app calls a real API.
 */
export function isMockApiMode(): boolean {
  return process.env.EXPO_PUBLIC_USE_MOCK_API !== "false";
}
