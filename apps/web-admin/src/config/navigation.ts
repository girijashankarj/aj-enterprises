import type { UserRole } from "../store/slices/authSlice";

export const navAdmin = [
  ["dashboard", "nav.dashboard"],
  ["marketing-leads", "nav.marketingLeads"],
  ["employees", "nav.employees"],
  ["tasks", "nav.tasks"],
  ["finance", "nav.finance"],
  ["leave", "nav.leave"],
  ["attendance", "nav.attendance"],
  ["analytics", "nav.analytics"],
  ["location", "nav.location"],
  ["settings", "nav.settings"]
] as const;

export const navEmployee = [
  ["dashboard", "nav.dashboard"],
  ["tasks", "nav.tasks"],
  ["finance", "nav.finance"],
  ["leave", "nav.leave"],
  ["attendance", "nav.attendance"],
  ["analytics", "nav.analytics"],
  ["location", "nav.location"],
  ["settings", "nav.settings"]
] as const;

const routeTitleMap: Record<string, string> = {
  dashboard: "Dashboard",
  "marketing-leads": "Marketing leads",
  employees: "Employees",
  tasks: "Tasks",
  finance: "Finance",
  leave: "Leave",
  attendance: "Attendance",
  analytics: "Analytics",
  location: "Location",
  settings: "Settings",
  login: "Sign in"
};

export function titleForPath(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean).at(-1) ?? "";
  return routeTitleMap[segment] ?? "AJ Enterprises";
}

export function navForRole(role: UserRole | null, basePath: string): readonly (readonly [string, string])[] {
  const items = role === "EMPLOYEE" ? navEmployee : navAdmin;
  return items.map(([path, label]) => [`${basePath}/${path}`, label] as const);
}

export function canAccessEmployees(role: UserRole | null): boolean {
  return role === "ADMIN" || role === "MANAGER";
}
