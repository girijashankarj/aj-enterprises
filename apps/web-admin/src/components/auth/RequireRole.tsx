import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import type { UserRole } from "../../store/slices/authSlice";

type Props = { roles: UserRole[]; children: ReactNode };

export function RequireRole({ roles, children }: Props) {
  const role = useAppSelector((s) => s.auth.role);
  if (!role || !roles.includes(role)) {
    return <Navigate to={role === "EMPLOYEE" ? "/host/employee/dashboard" : "/host/admin/dashboard"} replace />;
  }
  return children;
}
