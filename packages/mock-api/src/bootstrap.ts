import { mockAttendanceRecords } from "./fixtures/attendance";
import { mockDashboard } from "./fixtures/dashboard";
import { mockEmployees } from "./fixtures/employees";
import { mockFinanceEntries } from "./fixtures/finance";
import { mockLeaveRequests } from "./fixtures/leave";
import { mockTasks } from "./fixtures/tasks";

/** Web admin Redux bootstrap (mirrors DB-backed API responses). */
export function getWebAdminMockBootstrap() {
  return {
    employees: mockEmployees.map((e) => ({ ...e })),
    tasks: mockTasks.map((t) => ({ ...t })),
    dashboard: { ...mockDashboard },
    finance: { entries: mockFinanceEntries.map((e) => ({ ...e })) },
    leave: { requests: mockLeaveRequests.map((r) => ({ ...r })) },
    attendance: { records: mockAttendanceRecords.map((r) => ({ ...r })) }
  };
}

/** Mobile app initial slice-like state. */
export function getMobileMockBootstrap() {
  return {
    role: "EMPLOYEE" as const,
    tasks: mockTasks.map((t) => ({
      id: t.id,
      partName: t.partName,
      partNumber: t.partNumber,
      targetCount: t.targetCount,
      achievedCount: t.achievedCount,
      issue: t.issueNotes
    })),
    leave: {
      requests: mockLeaveRequests.map((r) => ({
        id: r.id,
        fromDate: r.fromDate,
        toDate: r.toDate,
        status: r.status
      }))
    },
    finance: {
      pending: 5000,
      advanceTaken: 3000
    }
  };
}
