import { useEffect, useRef } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Building2,
  Home,
  KeyRound,
  LogIn,
  Shield,
  Sparkles,
  UserCircle,
  Users
} from "lucide-react";
import { SITE } from "../config/site";
import { usePageTitle } from "../hooks/usePageTitle";
import { cn } from "../lib/cn";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { UserRole } from "../store/slices/authSlice";
import { signInFromApi, signInScaffold } from "../store/slices/authSlice";
import { pushToast } from "../store/slices/toastSlice";
import { BrandLogo } from "../components/BrandLogo";
import { HeaderControls } from "../components/layout/HeaderControls";
import { StandardHeader } from "../components/layout/StandardHeader";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Alert } from "../components/ui/Alert";
import { Tooltip, TooltipHint } from "../components/ui/Tooltip";

const apiBase = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const VALID_ROLES: UserRole[] = ["ADMIN", "MANAGER", "EMPLOYEE"];

const ROLE_ICONS: Record<UserRole, typeof Shield> = {
  ADMIN: Shield,
  MANAGER: Users,
  EMPLOYEE: UserCircle
};

function parseRoleParam(value: string | null): UserRole | null {
  if (!value) return null;
  return VALID_ROLES.includes(value as UserRole) ? (value as UserRole) : null;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (r: { credential: string }) => void }) => void;
          renderButton: (
            el: HTMLElement,
            config: { theme?: string; size?: string; text?: string; type?: string }
          ) => void;
        };
      };
    };
  }
}

export default function LoginPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const selectedRole = parseRoleParam(searchParams.get("role"));

  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const from = (location.state as { from?: string } | null)?.from ?? "/";
  const googleBtnRef = useRef<HTMLDivElement>(null);
  usePageTitle(selectedRole ? t("login.signInWithRole") : t("login.chooseRole"));

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  const useMock = import.meta.env.VITE_USE_MOCK_API !== "false";

  useEffect(() => {
    if (isAuthenticated || useMock || !googleClientId || !googleBtnRef.current || !selectedRole) return;

    const el = googleBtnRef.current;
    let cancelled = false;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      if (cancelled || !window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (res) => {
          try {
            const r = await fetch(`${apiBase.replace(/\/$/, "")}/api/auth/google/token`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken: res.credential })
            });
            if (!r.ok) {
              const err = (await r.json().catch(() => ({}))) as { message?: string };
              throw new Error(err?.message ?? `HTTP ${r.status}`);
            }
            const data = (await r.json()) as { token: string; user: { email: string; role: UserRole } };
            dispatch(
              signInFromApi({
                email: data.user.email,
                role: data.user.role,
                accessToken: data.token
              })
            );
            dispatch(pushToast({ message: t("login.toastSignedIn"), tone: "success" }));
            navigate(from, { replace: true });
          } catch (e) {
            dispatch(
              pushToast({
                message: e instanceof Error ? e.message : t("login.toastSignInFailed"),
                tone: "error"
              })
            );
          }
        }
      });
      window.google.accounts.id.renderButton(el, { theme: "outline", size: "large", text: "signin_with", type: "standard" });
    };
    document.body.appendChild(script);
    return () => {
      cancelled = true;
      script.remove();
    };
  }, [isAuthenticated, useMock, googleClientId, dispatch, navigate, from, selectedRole, t]);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const quick = (role: UserRole) => {
    dispatch(signInScaffold({ email: `dev-${role.toLowerCase()}@ak.local`, role }));
    dispatch(pushToast({ message: t("login.toastSignedInAs", { role: t(`login.role.${role}`) }), tone: "success" }));
    navigate(from, { replace: true });
  };

  const headerEnd = (
    <>
      <HeaderControls />
      <Link
        to="/"
        className={cn(
          "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] shadow-sm transition hover:bg-[var(--color-bg-subtle)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]/40"
        )}
      >
        <Home className="h-4 w-4 shrink-0 text-[var(--color-text-secondary)]" aria-hidden />
        {t("common.home", "Home")}
      </Link>
    </>
  );

  if (!selectedRole) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)] text-[var(--color-text-primary)]">
        <StandardHeader>
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
            <Link
              to="/"
              className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]/40"
            >
              <BrandLogo />
            </Link>
            <div className="hidden min-w-0 md:flex md:items-center md:gap-2">
              <Building2 className="h-4 w-4 shrink-0 text-[var(--color-brand-primary)]" aria-hidden />
              <span className="text-sm text-[var(--color-text-secondary)]">{t("login.chooseRole")}</span>
              <TooltipHint label={t("login.tooltipChooseRole")} className="ml-0.5" />
            </div>
          </div>
          <div className="flex w-full min-w-0 flex-wrap items-center justify-end gap-2 sm:w-auto">{headerEnd}</div>
        </StandardHeader>
        <main className="safe-px flex flex-1 flex-col items-center justify-center py-10">
          <div className="w-full max-w-3xl space-y-6">
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] md:text-3xl">
                {t("login.portalTitle")}
              </h1>
              <p className="mt-2 max-w-xl text-sm text-[var(--color-text-secondary)] md:text-base">
                {t("login.chooseRoleDescription")}
              </p>
            </div>
            <Card className="relative overflow-hidden border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-6 shadow-md sm:p-8">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--color-brand-primary)] via-[var(--color-info)] to-[var(--color-brand-primary)] opacity-90"
                aria-hidden
              />
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-[var(--color-brand-primary)]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                {t("login.stepPickRole")}
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {VALID_ROLES.map((role) => {
                  const Icon = ROLE_ICONS[role];
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => (useMock ? quick(role) : navigate(`/login?role=${role}`))}
                      className="group flex min-h-[100px] flex-col items-center justify-center gap-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-4 text-center shadow-sm transition hover:border-[var(--color-brand-primary)] hover:bg-[var(--color-bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]/40 sm:min-h-[120px]"
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-bg-subtle)] text-[var(--color-brand-primary)] transition group-hover:bg-[var(--color-brand-primary)]/10">
                        <Icon className="h-6 w-6" aria-hidden />
                      </span>
                      <span>
                        <span className="block text-base font-semibold text-[var(--color-text-primary)]">
                          {t(`login.role.${role}`)}
                        </span>
                        <span className="mt-1 block text-xs text-[var(--color-text-secondary)]">
                          {t(`login.roleHint.${role}`)}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-brand-primary)] opacity-0 transition group-hover:opacity-100">
                        <LogIn className="h-3.5 w-3.5" aria-hidden />
                        {t("login.continue")}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-8 flex items-center justify-center gap-2 border-t border-[var(--color-border-default)] pt-6 text-center text-sm text-[var(--color-text-secondary)]">
                <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
                <Link to="/" className="text-[var(--color-brand-primary)] hover:underline">
                  {t("login.backHome")}
                </Link>
              </p>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const RoleIcon = ROLE_ICONS[selectedRole];
  const isStaff = selectedRole === "EMPLOYEE";

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)] text-[var(--color-text-primary)]">
      <StandardHeader>
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
          <Link
            to="/"
            className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]/40"
          >
            <BrandLogo />
          </Link>
          <div className="hidden min-w-0 sm:flex sm:items-start sm:gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-bg-subtle)] text-[var(--color-brand-primary)]">
              <RoleIcon className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-brand-primary)]">
                {t(`login.role.${selectedRole}`)}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {isStaff ? t("login.staffSignInSubtitle") : t("login.signInContinue")}
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full min-w-0 flex-wrap items-center justify-end gap-2 sm:w-auto">{headerEnd}</div>
      </StandardHeader>
      <main className="safe-px flex flex-1 flex-col items-center justify-center py-10">
        <div className="w-full max-w-md space-y-4">
          {isStaff ? (
            <div className="rounded-2xl border border-[var(--color-border-default)] bg-gradient-to-br from-[var(--color-bg-surface)] to-[var(--color-bg-subtle)] p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
                  <UserCircle className="h-8 w-8" aria-hidden />
                </span>
                <div>
                  <h1 className="text-lg font-semibold text-[var(--color-text-primary)] sm:text-xl">
                    {t("login.staffPortalTitle")}
                  </h1>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{t("login.staffPortalBody")}</p>
                  <ul className="mt-3 space-y-1.5 text-xs text-[var(--color-text-secondary)]">
                    <li className="flex items-center gap-2">
                      <KeyRound className="h-3.5 w-3.5 shrink-0 text-[var(--color-brand-primary)]" aria-hidden />
                      {t("login.staffBulletSecure")}
                    </li>
                    <li className="flex items-center gap-2">
                      <LogIn className="h-3.5 w-3.5 shrink-0 text-[var(--color-brand-primary)]" aria-hidden />
                      {t("login.staffBulletAccess")}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : null}

          <Card className="relative space-y-6 overflow-hidden border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-6 shadow-md sm:p-8">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-info)] opacity-90"
              aria-hidden
            />

            <div className="sm:hidden">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-bg-subtle)] text-[var(--color-brand-primary)]">
                  <RoleIcon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-brand-primary)]">
                    {t(`login.role.${selectedRole}`)}
                  </p>
                  <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{SITE.name}</h2>
                  <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                    {isStaff ? t("login.staffSignInSubtitle") : t("login.signInContinue")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <Tooltip label={t("login.tooltipChangeRole")}>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center gap-1.5 rounded-md text-[var(--color-brand-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]/40"
                >
                  <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
                  {t("login.changeRole")}
                </button>
              </Tooltip>
              <span className="text-[var(--color-text-secondary)]" aria-hidden>
                ·
              </span>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]/40"
              >
                <Home className="h-4 w-4 shrink-0" aria-hidden />
                {t("login.backHome")}
              </Link>
            </div>

            {!useMock && !googleClientId ? (
              <Alert tone="error">
                Set <code className="text-xs">VITE_GOOGLE_CLIENT_ID</code> to match the API Google client, or enable mock mode
                with <code className="text-xs">VITE_USE_MOCK_API=true</code>.
              </Alert>
            ) : null}

            {!useMock && googleClientId ? (
              <div className="space-y-3">
                <p className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                  <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-brand-primary)]" aria-hidden />
                  <span>{t("login.googleHint")}</span>
                </p>
                <div ref={googleBtnRef} className="flex min-h-[44px] flex-col items-stretch justify-center" />
              </div>
            ) : null}

            {useMock ? (
              <div className="space-y-4">
                <Tooltip label={t("login.tooltipMockContinue")}>
                  <Button type="button" className="w-full gap-2" onClick={() => quick(selectedRole)}>
                    <LogIn className="h-4 w-4 shrink-0" aria-hidden />
                    {t("login.continueAs", { role: t(`login.role.${selectedRole}`) })}
                  </Button>
                </Tooltip>
                <div className="flex flex-wrap gap-2">
                  {VALID_ROLES.filter((r) => r !== selectedRole).map((role) => {
                    const Icon = ROLE_ICONS[role];
                    return (
                      <Button
                        key={role}
                        type="button"
                        variant="secondary"
                        className="gap-2"
                        onClick={() => quick(role)}
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden />
                        {t(`login.role.${role}`)}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </Card>
        </div>
      </main>
    </div>
  );
}
