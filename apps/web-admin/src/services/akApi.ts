import { getWebAdminMockBootstrap, mockDelay } from "@aj/mock-api";
import { isMockApiMode } from "../mocks/config";

/**
 * Async bootstrap (use when adding loading states / React Query later).
 * Today, web Redux uses synchronous `preloadedState` from mocks when mock mode is on.
 */
export async function fetchBootstrap() {
  if (isMockApiMode()) {
    await mockDelay(200);
    return getWebAdminMockBootstrap();
  }

  throw new Error(
    "Live API bootstrap is not wired yet. Keep VITE_USE_MOCK_API=true for prototype, or implement real fetches in akApi.ts."
  );
}
