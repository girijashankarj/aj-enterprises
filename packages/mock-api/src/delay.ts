/** Simulates network latency for mock API calls. */
export function mockDelay(ms = 180): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
