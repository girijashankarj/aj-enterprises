import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { RequireAuth } from "./components/auth/RequireAuth";
import { RequireRole } from "./components/auth/RequireRole";
import { AppShell } from "./components/layout/AppShell";
import { RouteFallback } from "./components/layout/RouteFallback";
import { LanguageSync } from "./components/LanguageSync";
import { MarketingScripts } from "./components/MarketingScripts";
import { ThemeSync } from "./components/ThemeSync";
import { ToastHost } from "./components/ToastHost";
import { titleForPath } from "./config/navigation";
import { SITE } from "./config/site";
import { usePageTitle } from "./hooks/usePageTitle";
import { useAppSelector } from "./store/hooks";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const EmployeesPage = lazy(() => import("./pages/EmployeesPage"));
const TasksPage = lazy(() => import("./pages/TasksPage"));
const FinancePage = lazy(() => import("./pages/FinancePage"));
const LeavePage = lazy(() => import("./pages/LeavePage"));
const AttendancePage = lazy(() => import("./pages/AttendancePage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const MarketingLeadsPage = lazy(() => import("./pages/MarketingLeadsPage"));
const LocationPage = lazy(() => import("./pages/LocationPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const PublicLandingPage = lazy(() => import("./pages/PublicLandingPage"));

function DocumentTitleSync() {
  const location = useLocation();
  const segment = titleForPath(location.pathname) ?? SITE.name;
  usePageTitle(segment);
  return null;
}

function RoleHomeRedirect() {
  const role = useAppSelector((s) => s.auth.role);
  if (role === "EMPLOYEE") {
    return <Navigate to="/host/employee/dashboard" replace />;
  }
  return <Navigate to="/host/admin/dashboard" replace />;
}

function PublicHomeRoute() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  if (isAuthenticated) {
    return <RoleHomeRedirect />;
  }
  return (
    <Suspense fallback={<RouteFallback />}>
      <PublicLandingPage />
    </Suspense>
  );
}

export function App() {
  return (
    <>
      <ThemeSync />
      <MarketingScripts />
      <LanguageSync />
      <DocumentTitleSync />
      <ToastHost />
      <Routes>
        <Route
          path="/"
          element={<PublicHomeRoute />}
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<RouteFallback />}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route element={<RequireAuth />}>
          <Route path="host/admin" element={<RequireRole roles={["ADMIN", "MANAGER"]}><AppShell /></RequireRole>}>
            <Route
              path="dashboard"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <DashboardPage />
                </Suspense>
              }
            />
            <Route
              path="marketing-leads"
              element={
                <RequireRole roles={["ADMIN", "MANAGER"]}>
                  <Suspense fallback={<RouteFallback />}>
                    <MarketingLeadsPage />
                  </Suspense>
                </RequireRole>
              }
            />
            <Route
              path="employees"
              element={
                <RequireRole roles={["ADMIN", "MANAGER"]}>
                  <Suspense fallback={<RouteFallback />}>
                    <EmployeesPage />
                  </Suspense>
                </RequireRole>
              }
            />
            <Route
              path="tasks"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <TasksPage />
                </Suspense>
              }
            />
            <Route
              path="finance"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <FinancePage />
                </Suspense>
              }
            />
            <Route
              path="leave"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <LeavePage />
                </Suspense>
              }
            />
            <Route
              path="attendance"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <AttendancePage />
                </Suspense>
              }
            />
            <Route
              path="location"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <LocationPage />
                </Suspense>
              }
            />
            <Route
              path="settings"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <SettingsPage />
                </Suspense>
              }
            />
            <Route
              path="analytics"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <AnalyticsPage />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          <Route path="host/employee" element={<RequireRole roles={["EMPLOYEE"]}><AppShell /></RequireRole>}>
            <Route
              path="dashboard"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <DashboardPage />
                </Suspense>
              }
            />
            <Route
              path="tasks"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <TasksPage />
                </Suspense>
              }
            />
            <Route
              path="finance"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <FinancePage />
                </Suspense>
              }
            />
            <Route
              path="leave"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <LeavePage />
                </Suspense>
              }
            />
            <Route
              path="attendance"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <AttendancePage />
                </Suspense>
              }
            />
            <Route
              path="location"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <LocationPage />
                </Suspense>
              }
            />
            <Route
              path="settings"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <SettingsPage />
                </Suspense>
              }
            />
            <Route
              path="analytics"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <AnalyticsPage />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to="/host/employee/dashboard" replace />} />
          </Route>
          <Route path="*" element={<RoleHomeRedirect />} />
        </Route>
      </Routes>
    </>
  );
}
