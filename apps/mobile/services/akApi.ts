import { getMobileMockBootstrap, mockDelay } from "@aj/mock-api";
import { isMockApiMode } from "../mocks/config";

/** Future: async load with loading UI; today preloadedState uses mocks synchronously. */
export async function fetchMobileBootstrap() {
  if (isMockApiMode()) {
    await mockDelay(150);
    return getMobileMockBootstrap();
  }
  throw new Error(
    "Live API bootstrap is not wired yet. Keep EXPO_PUBLIC_USE_MOCK_API=true for prototype, or implement real fetches in akApi.ts."
  );
}
