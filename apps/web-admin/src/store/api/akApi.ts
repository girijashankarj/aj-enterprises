import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { mockDelay } from "@aj/mock-api";
import type { AttendanceRow, Employee } from "../../types";
import type { Task } from "../../types";
import type { RootState } from "../index";
import { upsertAttendanceRecord } from "../slices/attendanceSlice";
import { addEmployee } from "../slices/employeesSlice";

type ApiUserRow = {
  id: string;
  email: string;
  fullName: string;
  employeeProfile?: {
    id?: string;
    salaryBase?: string | number | null;
    phone?: string | null;
  } | null;
};

function normalizeEmployeeFromApi(u: ApiUserRow): Employee {
  const sal = u.employeeProfile?.salaryBase;
  return {
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    salaryBase: sal == null ? 0 : typeof sal === "number" ? sal : Number(sal),
    phone: u.employeeProfile?.phone ?? null,
    employeeProfileId: u.employeeProfile?.id ?? null
  };
}

function normalizeEmployeeRow(row: unknown): Employee {
  if (!row || typeof row !== "object") {
    return { id: "", fullName: "", email: "", salaryBase: 0, phone: null, employeeProfileId: null };
  }
  if ("employeeProfile" in row && row.employeeProfile && typeof row.employeeProfile === "object") {
    return normalizeEmployeeFromApi(row as ApiUserRow);
  }
  const e = row as Employee;
  return {
    id: e.id,
    fullName: e.fullName,
    email: e.email,
    salaryBase: e.salaryBase,
    phone: e.phone ?? null,
    employeeProfileId: e.employeeProfileId ?? null
  };
}

function mapAttendanceApiItem(raw: unknown): AttendanceRow {
  const r = raw as {
    id: string;
    employeeProfileId: string;
    attendanceDate: string;
    isPresent: boolean;
    notes: string | null;
    employeeName?: string;
    employeeProfile?: { user?: { fullName?: string } };
  };
  const d = typeof r.attendanceDate === "string" ? r.attendanceDate.slice(0, 10) : "";
  const employeeName = r.employeeName ?? r.employeeProfile?.user?.fullName ?? "—";
  return {
    id: r.id,
    employeeProfileId: r.employeeProfileId,
    attendanceDate: d,
    isPresent: r.isPresent,
    notes: r.notes ?? null,
    employeeName
  };
}

export type CreateEmployeeRequest = {
  email: string;
  fullName: string;
  salaryBase: number;
  phone?: string;
};

type LedgerRow = {
  id: string;
  employeeName: string;
  type: "ADVANCE" | "CREDIT" | "PENDING";
  amount: number;
};

type LeaveRow = {
  id: string;
  employeeName: string;
  fromDate: string;
  toDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
};

type DashboardSnap = {
  dayAchieved: number;
  dayTarget: number;
  weekAchieved: number;
  weekTarget: number;
  byEmployee?: Record<string, { achieved: number; target: number }>;
};

export type UpsertAttendanceRequest = {
  employeeProfileId: string;
  attendanceDate: string;
  isPresent: boolean;
  notes?: string;
};

export type PublicLeadRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  pageUrl: string | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  createdAt: string;
};

type AttendanceListResponse = {
  items: AttendanceRow[];
  page: number;
  limit: number;
  total: number;
};

/** Mirrors Redux slice shapes; avoids circular import with store/index. */
const apiBase = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";
const useMock = import.meta.env.VITE_USE_MOCK_API !== "false";

type ApiRequest =
  | string
  | { path: string; method?: "GET" | "POST"; body?: Record<string, unknown> };

const baseQuery: BaseQueryFn<ApiRequest, unknown, { status: number; data: string }> = async (args, api) => {
  const path = typeof args === "string" ? args : args.path;
  const method = typeof args === "string" ? "GET" : (args.method ?? "GET");
  const body = typeof args === "string" ? undefined : args.body;

  if (!useMock) {
    const state = api.getState() as RootState;
    const token = state.auth.accessToken;
    const response = await fetch(`${apiBase.replace(/\/$/, "")}/api/${path}`, {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(method === "POST" && body !== undefined ? { "Content-Type": "application/json" } : {})
      },
      body: method === "POST" && body !== undefined ? JSON.stringify(body) : undefined
    });
    if (!response.ok) {
      return { error: { status: response.status, data: "API request failed" } };
    }
    const payload = (await response.json()) as unknown;
    return { data: payload };
  }

  await mockDelay(140);
  const state = api.getState() as RootState;
  if (path === "employees?page=1&limit=100") {
    return { data: { items: state.employees.list as Employee[] } };
  }
  if (path.startsWith("attendance?")) {
    const records = state.attendance.records;
    return {
      data: {
        items: records,
        page: 1,
        limit: 100,
        total: records.length
      }
    };
  }
  if (path === "attendance/me-profile") {
    if (state.auth.role === "EMPLOYEE") {
      const email = state.auth.email?.toLowerCase() ?? "";
      const match = state.employees.list.find((e) => e.email.toLowerCase() === email);
      return { data: { employeeProfileId: match?.employeeProfileId ?? "ep-1" } };
    }
    return { data: { employeeProfileId: null } };
  }
  if (path === "tasks?page=1&limit=200") {
    return { data: { items: state.tasks.items as Task[] } };
  }
  if (path === "finance") {
    return { data: state.finance.entries };
  }
  if (path === "leave") {
    return { data: state.leave.requests };
  }
  if (path === "dashboard/summary") {
    return { data: state.dashboard };
  }
  if (path.startsWith("marketing/leads?")) {
    return {
      data: {
        items: [] as PublicLeadRow[],
        page: 1,
        limit: 20,
        total: 0
      }
    };
  }
  return { error: { status: 404, data: "Unknown resource" } };
};

export const akApi = createApi({
  reducerPath: "akApi",
  baseQuery,
  tagTypes: ["Employees", "Tasks", "Finance", "Leave", "Dashboard", "Attendance", "MarketingLeads"],
  endpoints: (build) => ({
    getEmployees: build.query<Employee[], void>({
      query: () => "employees?page=1&limit=100",
      transformResponse: (response: Employee[] | { items: unknown[] }) => {
        const items = Array.isArray(response) ? response : response.items;
        return items.map(normalizeEmployeeRow);
      },
      providesTags: ["Employees"]
    }),
    createEmployee: build.mutation<Employee, CreateEmployeeRequest>({
      async queryFn(arg, api) {
        const phoneTrimmed = arg.phone?.trim();
        const body: Record<string, unknown> = {
          email: arg.email,
          fullName: arg.fullName,
          salaryBase: arg.salaryBase
        };
        if (phoneTrimmed) body.phone = phoneTrimmed;

        if (useMock) {
          await mockDelay(140);
          const emp: Employee = {
            id: crypto.randomUUID(),
            fullName: arg.fullName,
            email: arg.email,
            salaryBase: arg.salaryBase,
            phone: phoneTrimmed ?? null
          };
          api.dispatch(addEmployee(emp));
          return { data: emp };
        }
        const result = await baseQuery({ path: "employees", method: "POST", body }, api, {});
        if ("error" in result && result.error) {
          return { error: result.error };
        }
        const raw = result.data as ApiUserRow;
        return { data: normalizeEmployeeFromApi(raw) };
      },
      invalidatesTags: ["Employees"]
    }),
    getTasks: build.query<Task[], void>({
      query: () => "tasks?page=1&limit=200",
      transformResponse: (response: Task[] | { items: Task[] }) => (Array.isArray(response) ? response : response.items),
      providesTags: ["Tasks"]
    }),
    getFinance: build.query<LedgerRow[], void>({
      query: () => "finance",
      providesTags: ["Finance"]
    }),
    getLeave: build.query<LeaveRow[], void>({
      query: () => "leave",
      providesTags: ["Leave"]
    }),
    getAttendance: build.query<
      AttendanceListResponse,
      { fromDate: string; toDate: string; employeeProfileId?: string }
    >({
      query: ({ fromDate, toDate, employeeProfileId }) => {
        const params = new URLSearchParams({ fromDate, toDate, page: "1", limit: "100" });
        if (employeeProfileId) params.set("employeeProfileId", employeeProfileId);
        return `attendance?${params.toString()}`;
      },
      transformResponse: (response: {
        items: unknown[];
        page: number;
        limit: number;
        total: number;
      }): AttendanceListResponse => ({
        ...response,
        items: response.items.map((x) => mapAttendanceApiItem(x))
      }),
      providesTags: ["Attendance"]
    }),
    getAttendanceMeProfile: build.query<{ employeeProfileId: string | null }, void>({
      query: () => "attendance/me-profile",
      providesTags: ["Attendance"]
    }),
    upsertAttendance: build.mutation<AttendanceRow, UpsertAttendanceRequest>({
      async queryFn(arg, api) {
        const body: Record<string, unknown> = {
          employeeProfileId: arg.employeeProfileId,
          attendanceDate: arg.attendanceDate,
          isPresent: arg.isPresent
        };
        if (arg.notes?.trim()) body.notes = arg.notes.trim();

        if (useMock) {
          await mockDelay(140);
          const state = api.getState() as RootState;
          const emp = state.employees.list.find((e) => e.employeeProfileId === arg.employeeProfileId);
          const existing = state.attendance.records.find(
            (r) =>
              r.employeeProfileId === arg.employeeProfileId && r.attendanceDate === arg.attendanceDate
          );
          const row: AttendanceRow = {
            id: existing?.id ?? crypto.randomUUID(),
            employeeProfileId: arg.employeeProfileId,
            attendanceDate: arg.attendanceDate,
            isPresent: arg.isPresent,
            notes: arg.notes?.trim() ?? null,
            employeeName: emp?.fullName ?? "Employee"
          };
          api.dispatch(upsertAttendanceRecord(row));
          return { data: row };
        }

        const result = await baseQuery({ path: "attendance", method: "POST", body }, api, {});
        if ("error" in result && result.error) {
          return { error: result.error };
        }
        return { data: mapAttendanceApiItem(result.data) };
      },
      invalidatesTags: ["Attendance"]
    }),
    getDashboard: build.query<DashboardSnap, void>({
      query: () => "dashboard/summary",
      transformResponse: (response: DashboardSnap | { day: { achieved: number; target: number }; week: { achieved: number; target: number }; byEmployee?: Record<string, { achieved: number; target: number }> }) => {
        if ("dayAchieved" in response) return response;
        return {
          dayAchieved: response.day.achieved,
          dayTarget: response.day.target,
          weekAchieved: response.week.achieved,
          weekTarget: response.week.target,
          byEmployee: response.byEmployee
        };
      },
      providesTags: ["Dashboard"]
    }),
    getMarketingLeads: build.query<
      { items: PublicLeadRow[]; page: number; limit: number; total: number },
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        return `marketing/leads?${params.toString()}`;
      },
      transformResponse: (response: {
        items: PublicLeadRow[];
        page: number;
        limit: number;
        total: number;
      }) => ({
        ...response,
        items: response.items.map((row) => ({
          ...row,
          createdAt:
            typeof row.createdAt === "string" ? row.createdAt : new Date(row.createdAt).toISOString()
        }))
      }),
      providesTags: ["MarketingLeads"]
    })
  })
});

export const {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useGetTasksQuery,
  useGetFinanceQuery,
  useGetLeaveQuery,
  useGetAttendanceQuery,
  useGetAttendanceMeProfileQuery,
  useUpsertAttendanceMutation,
  useGetDashboardQuery,
  useGetMarketingLeadsQuery
} = akApi;
