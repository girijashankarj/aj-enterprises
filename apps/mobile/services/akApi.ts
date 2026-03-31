import { getMobileMockBootstrap, mockDelay } from "@aj/mock-api";
import { isMockApiMode } from "../mocks/config";

/**
 * Legacy bootstrap helper for mock fixtures. Live mode uses `hydrateMobileStoreData` in `liveApi.ts`
 * after Google sign-in (`AuthContext`).
 */
export async function fetchMobileBootstrap() {
  if (isMockApiMode()) {
    await mockDelay(150);
    return getMobileMockBootstrap();
  }
  throw new Error(
    "Live data loads after sign-in via hydrateMobileStoreData (see services/liveApi.ts). Set EXPO_PUBLIC_USE_MOCK_API=true for offline fixtures."
  );
}
