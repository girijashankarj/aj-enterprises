import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Copy, Mail, Search, UserPlus, Users, X } from "lucide-react";
import { useCreateEmployeeMutation, useGetEmployeesQuery } from "../store/api/akApi";
import { useAppDispatch } from "../store/hooks";
import { pushToast } from "../store/slices/toastSlice";
import { Card, CardDescription, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Alert";
import { Table, TBody, Td, Th, THead, Tr } from "../components/ui/Table";
import { Spinner } from "../components/ui/Spinner";
import { PaginationBar } from "../components/PaginationBar";
import { usePagination } from "../hooks/usePagination";
import { Tooltip, TooltipHint } from "../components/ui/Tooltip";
import { cn } from "../lib/cn";

export default function EmployeesPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { data: employees = [], isLoading, isError, refetch } = useGetEmployeesQuery();
  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const [q, setQ] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const selectAllRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return employees;
    return employees.filter(
      (e) =>
        e.fullName.toLowerCase().includes(s) ||
        e.email.toLowerCase().includes(s) ||
        (e.phone ?? "").toLowerCase().includes(s)
    );
  }, [employees, q]);

  const { page, setPage, pageSize, setPageSize, pageItems, pageCount, showingLabel } = usePagination(
    filtered,
    10
  );

  const pageIds = useMemo(() => pageItems.map((e) => e.id), [pageItems]);
  const selectedOnPage = useMemo(
    () => pageIds.filter((id) => selectedIds.has(id)).length,
    [pageIds, selectedIds]
  );
  const allOnPageSelected = pageIds.length > 0 && selectedOnPage === pageIds.length;
  const someOnPageSelected = selectedOnPage > 0 && !allOnPageSelected;

  useEffect(() => {
    const el = selectAllRef.current;
    if (el) el.indeterminate = someOnPageSelected;
  }, [someOnPageSelected]);

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAllPage = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        for (const id of pageIds) next.delete(id);
      } else {
        for (const id of pageIds) next.add(id);
      }
      return next;
    });
  }, [allOnPageSelected, pageIds]);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const copySelectedEmails = useCallback(async () => {
    const chosen = employees.filter((e) => selectedIds.has(e.id));
    if (chosen.length === 0) {
      dispatch(pushToast({ message: t("employees.toastNoneSelected"), tone: "error" }));
      return;
    }
    const text = chosen.map((e) => e.email).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      dispatch(pushToast({ message: t("employees.toastCopiedEmails", { count: chosen.length }), tone: "success" }));
    } catch {
      dispatch(pushToast({ message: t("employees.toastCopyFailed"), tone: "error" }));
    }
  }, [dispatch, employees, selectedIds, t]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const fullName = String(form.get("fullName"));
    const email = String(form.get("email"));
    const salaryBase = Number(form.get("salaryBase"));
    const phone = String(form.get("phone") ?? "").trim();
    try {
      await createEmployee({
        fullName,
        email,
        salaryBase,
        ...(phone ? { phone } : {})
      }).unwrap();
      dispatch(pushToast({ message: "Employee added", tone: "success" }));
      e.currentTarget.reset();
    } catch {
      dispatch(pushToast({ message: "Could not add employee", tone: "error" }));
    }
  };

  if (isLoading) {
    return (
      <Card className="flex min-h-[12rem] items-center justify-center">
        <Spinner label="Loading employees" />
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert tone="error" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>Could not load employees.</span>
        <Button type="button" variant="secondary" onClick={() => void refetch()}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start gap-3">
        <Users className="mt-0.5 h-8 w-8 shrink-0 text-[var(--color-brand-primary)]" aria-hidden />
        <div>
          <CardTitle className="flex items-center gap-2">
            Employees
            <TooltipHint label={t("employees.tooltipAdd")} />
          </CardTitle>
          <CardDescription>Master roster for planning and payroll inputs.</CardDescription>
        </div>
      </div>

      <form onSubmit={(e) => void onSubmit(e)} className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-6">
        <label className="sr-only" htmlFor="emp-name">
          Full name
        </label>
        <Input id="emp-name" name="fullName" placeholder="Full name" required className="min-w-0" />
        <label className="sr-only" htmlFor="emp-email">
          Email
        </label>
        <Input id="emp-email" name="email" type="email" placeholder="Email" required className="min-w-0" />
        <label className="sr-only" htmlFor="emp-phone">
          Mobile number
        </label>
        <Input
          id="emp-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="Mobile number"
          className="min-w-0"
        />
        <label className="sr-only" htmlFor="emp-salary">
          Salary base
        </label>
        <div className="flex min-w-0 items-center gap-1 lg:col-span-1">
          <Input id="emp-salary" name="salaryBase" type="number" placeholder="Salary (Rs.)" required className="min-w-0 flex-1" />
          <TooltipHint label={t("employees.tooltipSalary")} className="shrink-0" />
        </div>
        <Tooltip label={t("employees.tooltipAdd")}>
          <Button type="submit" disabled={isCreating} className="w-full gap-2 lg:w-auto">
            <UserPlus className="h-4 w-4 shrink-0" aria-hidden />
            {isCreating ? "Adding…" : "Add employee"}
          </Button>
        </Tooltip>
      </form>

      <div className="mt-6">
        <div className="flex max-w-md flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor="emp-filter" className="sr-only">
            Filter employees
          </label>
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-secondary)]"
              aria-hidden
            />
            <Input
              id="emp-filter"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, email, or mobile…"
              className="min-w-0 pl-9"
              aria-describedby="emp-filter-hint"
            />
          </div>
          <TooltipHint label={t("employees.tooltipSearch")} className="self-start sm:self-center" />
        </div>
        <p id="emp-filter-hint" className="mt-1 text-xs text-[var(--color-text-secondary)]">
          Filters the list below (client-side).
        </p>
      </div>

      {selectedIds.size > 0 ? (
        <div
          className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] px-3 py-2 text-sm"
          role="status"
        >
          <Mail className="h-4 w-4 shrink-0 text-[var(--color-brand-primary)]" aria-hidden />
          <span className="font-medium text-[var(--color-text-primary)]">
            {t("employees.selected", { count: selectedIds.size })}
          </span>
          <div className="ml-auto flex flex-wrap gap-2">
            <Tooltip label={t("employees.copyEmails")}>
              <Button type="button" variant="secondary" className="gap-2" onClick={() => void copySelectedEmails()}>
                <Copy className="h-4 w-4 shrink-0" aria-hidden />
                {t("employees.copyEmails")}
              </Button>
            </Tooltip>
            <Tooltip label={t("employees.clearSelection")}>
              <Button type="button" variant="ghost" className="gap-2" onClick={clearSelection}>
                <X className="h-4 w-4 shrink-0" aria-hidden />
                {t("employees.clearSelection")}
              </Button>
            </Tooltip>
          </div>
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-[var(--color-border-default)] px-4 py-8 text-center text-sm text-[var(--color-text-secondary)]">
          {employees.length === 0 ? "No employees yet. Add one above." : "No matches for your search."}
        </p>
      ) : (
        <>
          <Table aria-label="Employees" wrapClassName="mt-6">
            <caption className="sr-only">Employee roster with mobile and salary base</caption>
            <THead>
              <Tr>
                <Th className="w-12">
                  <span className="sr-only">{t("employees.selectColumn")}</span>
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={toggleSelectAllPage}
                    className="h-4 w-4 rounded border-[var(--color-border-default)] text-[var(--color-brand-primary)] focus:ring-2 focus:ring-[var(--color-brand-primary)]/40"
                    aria-label={t("employees.selectAllPage")}
                  />
                </Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Mobile</Th>
                <Th className="text-right">Salary (Rs.)</Th>
              </Tr>
            </THead>
            <TBody>
              {pageItems.map((e) => (
                <Tr key={e.id} className={cn(selectedIds.has(e.id) && "bg-[var(--color-bg-subtle)]/80")}>
                  <Td className="w-12 align-middle">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(e.id)}
                      onChange={() => toggleRow(e.id)}
                      className="h-4 w-4 rounded border-[var(--color-border-default)] text-[var(--color-brand-primary)] focus:ring-2 focus:ring-[var(--color-brand-primary)]/40"
                      aria-label={`Select ${e.fullName}`}
                    />
                  </Td>
                  <Td className="font-medium">{e.fullName}</Td>
                  <Td>{e.email}</Td>
                  <Td className="tabular-nums">{e.phone ?? "—"}</Td>
                  <Td className="text-right tabular-nums">{e.salaryBase}</Td>
                </Tr>
              ))}
            </TBody>
          </Table>
          <PaginationBar
            page={page}
            pageCount={pageCount}
            setPage={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            showingLabel={showingLabel}
          />
        </>
      )}
    </Card>
  );
}
