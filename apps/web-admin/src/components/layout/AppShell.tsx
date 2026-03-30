import { useId, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BrandLogo } from "../BrandLogo";
import { SiteFooter } from "../SiteFooter";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { HeaderControls } from "./HeaderControls";
import { StandardHeader } from "./StandardHeader";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { signOut } from "../../store/slices/authSlice";
import { navForRole } from "../../config/navigation";

export function AppShell() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const role = useAppSelector((s) => s.auth.role);
  const email = useAppSelector((s) => s.auth.email);
  const basePath = role === "EMPLOYEE" ? "/host/employee" : "/host/admin";
  const navItems = navForRole(role, basePath);
  const [mobileOpen, setMobileOpen] = useState(false);
  const titleId = useId();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)] text-[var(--color-text-primary)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-[max(1rem,env(safe-area-inset-left,0px))] focus:top-[max(1rem,env(safe-area-inset-top,0px))] focus:z-50 focus:rounded-lg focus:bg-[var(--color-brand-primary)] focus:px-4 focus:py-2 focus:text-white"
      >
        {t("common.skipToContent", "Skip to content")}
      </a>

      <StandardHeader>
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            className="min-h-11 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => setMobileOpen(true)}
          >
            {t("common.menu", "Menu")}
          </Button>
          <Link to={`${basePath}/dashboard`} className="min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]/40 rounded-lg">
            <BrandLogo />
          </Link>
          {role === "EMPLOYEE" ? (
            <Badge tone="amber" className="hidden sm:inline">
              Employee
            </Badge>
          ) : (
            <Badge tone="sky" className="hidden sm:inline">
              {role ?? t("common.staff", "Staff")}
            </Badge>
          )}
        </div>
        <div className="flex w-full min-w-0 flex-wrap items-center justify-end gap-2 sm:w-auto">
          {email ? (
            <span
              className="hidden max-w-[12rem] truncate text-xs text-[var(--color-text-secondary)] sm:inline"
              title={email ?? undefined}
            >
              {email}
            </span>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              dispatch(signOut());
              navigate("/login", { replace: true });
            }}
          >
            {t("common.signOut")}
          </Button>
          <HeaderControls />
        </div>
      </StandardHeader>

      <MobileNavDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={navItems}
        titleId={titleId}
      />

      <div className="safe-px mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 py-6 lg:flex-row lg:gap-8">
        <aside className="hidden shrink-0 lg:block lg:w-56">
          <nav
            className="sticky top-24 flex flex-col gap-1 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-2 shadow-sm"
            aria-label={t("common.primaryNav", "Primary")}
          >
            {navItems.map(([path, label]) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-[var(--color-brand-primary)] text-white shadow-sm"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)]"
                  }`
                }
              >
                {t(label)}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main id="main-content" className="min-w-0 flex-1 space-y-6">
          <Outlet />
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
