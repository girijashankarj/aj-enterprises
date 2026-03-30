import { useTranslation } from "react-i18next";
import { SITE } from "../config/site";
import { useGetDashboardQuery } from "../store/api/akApi";
import { Card, CardDescription, CardTitle } from "../components/ui/Card";
import { Alert } from "../components/ui/Alert";
import { Skeleton } from "../components/ui/Skeleton";
import { Button } from "../components/ui/Button";
import { useAppSelector } from "../store/hooks";
import { downloadCsv } from "../utils/exportCsv";
import { downloadPdfViaPrint } from "../utils/exportPdf";

export default function DashboardPage() {
  const { t } = useTranslation();
  const role = useAppSelector((s) => s.auth.role);
  const employeeUi = role === "EMPLOYEE";
  const { data: dashboard, isLoading, isError, refetch } = useGetDashboardQuery();

  if (isLoading || !dashboard) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-3xl" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert tone="error" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>Could not load dashboard metrics.</span>
        <Button type="button" variant="secondary" onClick={() => void refetch()}>
          {t("common.retry")}
        </Button>
      </Alert>
    );
  }

  const percent = dashboard.dayTarget > 0 ? Math.round((dashboard.dayAchieved / dashboard.dayTarget) * 100) : 0;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-md dark:border-slate-700 dark:bg-slate-900">
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="relative min-h-[220px] lg:min-h-[280px]">
            <img
              src={SITE.heroPhoto.src}
              alt={SITE.heroPhoto.alt}
              width={900}
              height={600}
              className="h-full w-full object-cover"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-slate-900/30 lg:to-slate-900/75" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white lg:p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-sky-200/90">{SITE.location}</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
                {employeeUi ? "Your shift at a glance" : "Shop-floor visibility, one screen"}
              </h2>
              <p className="mt-2 max-w-lg text-sm text-slate-200/95">
                Track targets vs achieved, surface issues early, and keep payroll context aligned with production.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-4 p-6 lg:p-8">
            <img
              src={SITE.bannerPath}
              alt={`${SITE.name} brand banner`}
              width={640}
              height={360}
              className="w-full rounded-2xl border border-slate-200/80 shadow-sm dark:border-slate-600"
              loading="eager"
            />
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{SITE.description}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardTitle>{t("dashboard.dayProgress")}</CardTitle>
          <CardDescription>Target completion</CardDescription>
          <p className="mt-3 text-3xl font-bold tabular-nums text-sky-600 dark:text-sky-400">
            {dashboard.dayAchieved}{" "}
            <span className="text-lg font-medium text-slate-400 dark:text-slate-500">/ {dashboard.dayTarget}</span>
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-amber-400 transition-[width] motion-reduce:transition-none"
              style={{ width: `${Math.min(100, percent)}%` }}
            />
          </div>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-800 dark:text-slate-100">{percent}%</p>
        </Card>
        <Card>
          <CardTitle>{t("dashboard.weekProgress")}</CardTitle>
          <CardDescription>Batch throughput vs weekly plan</CardDescription>
          <p className="mt-3 text-3xl font-bold tabular-nums text-slate-800 dark:text-slate-100">
            {dashboard.weekAchieved}{" "}
            <span className="text-lg font-medium text-slate-400 dark:text-slate-500">/ {dashboard.weekTarget}</span>
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-700">
            <img
              src={SITE.secondaryPhoto.src}
              alt={SITE.secondaryPhoto.alt}
              width={600}
              height={360}
              className="h-36 w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </Card>
      </section>
      <section className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            downloadCsv("dashboard-summary.csv", [
              { metric: "dayAchieved", value: dashboard.dayAchieved },
              { metric: "dayTarget", value: dashboard.dayTarget },
              { metric: "weekAchieved", value: dashboard.weekAchieved },
              { metric: "weekTarget", value: dashboard.weekTarget }
            ])
          }
        >
          Export CSV
        </Button>
        <Button type="button" variant="secondary" onClick={() => downloadPdfViaPrint("dashboard-summary")}>
          Export PDF
        </Button>
      </section>
    </div>
  );
}
