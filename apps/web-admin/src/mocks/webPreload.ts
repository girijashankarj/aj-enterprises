import { getWebAdminMockBootstrap } from "@aj/mock-api";
import { isMockApiMode } from "./config";

/** Redux preloaded state when running against mock fixtures (no API/DB). */
export function getWebPreloadedState() {
  if (!isMockApiMode()) return undefined;
  const b = getWebAdminMockBootstrap();
  return {
    employees: { list: b.employees },
    tasks: { items: b.tasks },
    dashboard: b.dashboard,
    finance: b.finance,
    leave: { requests: b.leave.requests },
    attendance: { records: b.attendance.records }
  };
}
