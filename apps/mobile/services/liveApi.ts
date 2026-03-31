import { apiFetchJson, apiPostPublic } from "./apiClient";

export type ApiUserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: ApiUserRole;
};

export type LoginResponse = {
  token: string;
  user: SessionUser;
};

export type MobileTask = {
  id: string;
  partName: string;
  partNumber: string;
  targetCount: number;
  achievedCount: number;
  issue?: string;
};

type TaskAssignmentDto = {
  id: string;
  achievedCount: number;
  targetCount: number;
  issueNotes: string | null;
  taskTemplate: { partName: string; partNumber: string };
};

type LeaveDto = {
  id: string;
  fromDate: string;
  toDate: string;
  status: string;
};

function isoDate(d: string): string {
  return d.slice(0, 10);
}

function mapAssignment(a: TaskAssignmentDto): MobileTask {
  return {
    id: a.id,
    partName: a.taskTemplate.partName,
    partNumber: a.taskTemplate.partNumber,
    targetCount: a.targetCount,
    achievedCount: a.achievedCount,
    issue: a.issueNotes ?? undefined
  };
}

export async function exchangeGoogleToken(idToken: string): Promise<LoginResponse> {
  const body: Record<string, unknown> = { idToken };
  const signupRole = process.env.EXPO_PUBLIC_AUTH_SIGNUP_ROLE?.trim();
  if (signupRole === "ADMIN" || signupRole === "MANAGER" || signupRole === "EMPLOYEE") {
    body.role = signupRole;
  }
  return apiPostPublic<LoginResponse>("auth/google/token", body);
}

export async function fetchTasksForMobile(
  token: string,
  userId: string,
  role: ApiUserRole
): Promise<MobileTask[]> {
  const q =
    role === "EMPLOYEE"
      ? `tasks?page=1&limit=100&employeeId=${encodeURIComponent(userId)}`
      : `tasks?page=1&limit=100`;
  const res = await apiFetchJson<{ items: TaskAssignmentDto[] }>(q, { token });
  return res.items.map(mapAssignment);
}

export async function postTaskProgress(
  token: string,
  assignmentId: string,
  body: { incrementCount: number; issueNotes?: string; employeeId: string }
): Promise<void> {
  await apiFetchJson<unknown>(`tasks/${encodeURIComponent(assignmentId)}/progress`, {
    method: "POST",
    token,
    body: JSON.stringify(body)
  });
}

export type LeaveRow = { id: string; fromDate: string; toDate: string; status: string };

export async function fetchLeaveRequests(token: string, employeeUserId: string): Promise<LeaveRow[]> {
  const rows = await apiFetchJson<LeaveDto[]>(
    `leave/requests/${encodeURIComponent(employeeUserId)}`,
    { token }
  );
  return rows.map((r) => ({
    id: r.id,
    fromDate: isoDate(r.fromDate),
    toDate: isoDate(r.toDate),
    status: r.status
  }));
}

export async function createLeaveRequest(
  token: string,
  body: { employeeId: string; fromDate: string; toDate: string; totalDays: number; reason?: string }
): Promise<void> {
  await apiFetchJson("leave/requests", {
    method: "POST",
    token,
    body: JSON.stringify(body)
  });
}

export type FinanceSnapshot = { pending: number; advanceTaken: number };

type LedgerEntryDto = {
  entryType: string;
  amount: string | number;
};

export async function fetchFinanceSnapshotForManager(
  token: string
): Promise<FinanceSnapshot | null> {
  const list = await apiFetchJson<{ items: { id: string }[] }>("employees?page=1&limit=100", {
    token
  });
  const first = list.items?.[0];
  if (!first?.id) return null;
  const entries = await apiFetchJson<LedgerEntryDto[]>(
    `finance/ledger/${encodeURIComponent(first.id)}`,
    { token }
  );
  let advance = 0;
  let credit = 0;
  for (const e of entries) {
    const n = typeof e.amount === "number" ? e.amount : Number(e.amount);
    if (e.entryType === "ADVANCE") advance += n;
    if (e.entryType === "SALARY_CREDIT") credit += n;
  }
  return {
    advanceTaken: Math.round(advance),
    pending: Math.max(0, Math.round(credit - advance))
  };
}

export type EmployeeRow = { id: string; email: string; fullName: string };

export async function fetchEmployees(token: string): Promise<EmployeeRow[]> {
  const res = await apiFetchJson<{ items: { id: string; email: string; fullName: string }[] }>(
    "employees?page=1&limit=100",
    { token }
  );
  return res.items.map((u) => ({ id: u.id, email: u.email, fullName: u.fullName }));
}

export async function createEmployee(
  token: string,
  body: { email: string; fullName: string; salaryBase: number; phone?: string }
): Promise<void> {
  await apiFetchJson("employees", {
    method: "POST",
    token,
    body: JSON.stringify(body)
  });
}

export async function assignTask(
  token: string,
  body: {
    employeeId: string;
    assignedById: string;
    assignmentDate: string;
    targetCount: number;
    partNumber: string;
    partName: string;
  }
): Promise<void> {
  await apiFetchJson("tasks/assign", {
    method: "POST",
    token,
    body: JSON.stringify(body)
  });
}

export async function hydrateMobileStoreData(
  token: string,
  userId: string,
  role: ApiUserRole
): Promise<{
  tasks: MobileTask[];
  leave: LeaveRow[];
  finance: FinanceSnapshot | null;
}> {
  const tasks = await fetchTasksForMobile(token, userId, role);
  const leave = await fetchLeaveRequests(token, userId);
  let finance: FinanceSnapshot | null = null;
  if (role === "ADMIN" || role === "MANAGER") {
    finance = await fetchFinanceSnapshotForManager(token);
  }
  return { tasks, leave, finance };
}
