import { type FormEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetAttendanceMeProfileQuery,
  useGetAttendanceQuery,
  useGetEmployeesQuery,
  useUpsertAttendanceMutation
} from "../store/api/akApi";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { pushToast } from "../store/slices/toastSlice";
import { Card, CardDescription, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Alert";
import { Table, TBody, Td, Th, THead, Tr } from "../components/ui/Table";
import { Spinner } from "../components/ui/Spinner";
import { PaginationBar } from "../components/PaginationBar";
import { usePagination } from "../hooks/usePagination";
import { canAccessEmployees } from "../config/navigation";

function defaultDateRange(): { fromDate: string; toDate: string } {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 14);
  return {
    fromDate: from.toISOString().slice(0, 10),
    toDate: to.toISOString().slice(0, 10)
  };
}

export default function AttendancePage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const role = useAppSelector((s) => s.auth.role);
  const [{ fromDate, toDate }, setRange] = useState(defaultDateRange);
  const [filterEmployeeProfileId, setFilterEmployeeProfileId] = useState("");
  const [q, setQ] = useState("");

  const showEmployeePicker = canAccessEmployees(role);
  const { data: employees = [] } = useGetEmployeesQuery(undefined, { skip: !showEmployeePicker });
  const { data: meProfile, isLoading: meLoading } = useGetAttendanceMeProfileQuery(undefined, {
    skip: role !== "EMPLOYEE"
  });

  const listArgs = useMemo(() => {
    const base = { fromDate, toDate };
    if (showEmployeePicker && filterEmployeeProfileId.trim()) {
      return { ...base, employeeProfileId: filterEmployeeProfileId.trim() };
    }
    return base;
  }, [fromDate, toDate, filterEmployeeProfileId, showEmployeePicker]);

  const { data: attendanceData, isLoading, isError, refetch } = useGetAttendanceQuery(listArgs);
  const [upsertAttendance, { isLoading: isSaving }] = useUpsertAttendanceMutation();

  const items = useMemo(() => attendanceData?.items ?? [], [attendanceData]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(
      (r) =>
        r.employeeName.toLowerCase().includes(s) ||
        r.attendanceDate.includes(s) ||
        (r.notes ?? "").toLowerCase().includes(s)
    );
  }, [items, q]);

  const { page, setPage, pageSize, setPageSize, pageItems, pageCount, showingLabel } = usePagination(filtered, 10);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const attendanceDate = String(form.get("attendanceDate"));
    const isPresent = form.get("isPresent") === "on";
    const notes = String(form.get("notes") ?? "").trim();

    let employeeProfileId: string | undefined;
    if (role === "EMPLOYEE") {
      employeeProfileId = meProfile?.employeeProfileId ?? undefined;
      if (!employeeProfileId) {
        dispatch(pushToast({ message: t("attendance.noProfile"), tone: "error" }));
        return;
      }
    } else {
      employeeProfileId = String(form.get("employeeProfileId") ?? "").trim();
      if (!employeeProfileId) {
        dispatch(pushToast({ message: t("attendance.pickEmployee"), tone: "error" }));
        return;
      }
    }

    try {
      await upsertAttendance({
        employeeProfileId,
        attendanceDate,
        isPresent,
        ...(notes ? { notes } : {})
      }).unwrap();
      dispatch(pushToast({ message: t("attendance.saved"), tone: "success" }));
      e.currentTarget.reset();
    } catch {
      dispatch(pushToast({ message: t("attendance.saveFailed"), tone: "error" }));
    }
  };

  if (isLoading) {
    return (
      <Card className="flex min-h-[12rem] items-center justify-center">
        <Spinner label={t("attendance.loading")} />
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert tone="error" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>{t("attendance.loadError")}</span>
        <Button type="button" variant="secondary" onClick={() => void refetch()}>
          {t("common.retry")}
        </Button>
      </Alert>
    );
  }

  return (
    <Card>
      <CardTitle>{t("attendance.title")}</CardTitle>
      <CardDescription>{t("attendance.description")}</CardDescription>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400" htmlFor="range-from">
            {t("attendance.fromDate")}
          </label>
          <Input
            id="range-from"
            type="date"
            value={fromDate}
            onChange={(e) => setRange((r) => ({ ...r, fromDate: e.target.value }))}
            className="w-44"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400" htmlFor="range-to">
            {t("attendance.toDate")}
          </label>
          <Input
            id="range-to"
            type="date"
            value={toDate}
            onChange={(e) => setRange((r) => ({ ...r, toDate: e.target.value }))}
            className="w-44"
          />
        </div>
        {showEmployeePicker ? (
          <div className="min-w-[12rem] flex-1">
            <label
              className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
              htmlFor="filter-employee"
            >
              {t("attendance.filterEmployee")}
            </label>
            <select
              id="filter-employee"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-600 dark:bg-slate-900"
              value={filterEmployeeProfileId}
              onChange={(e) => setFilterEmployeeProfileId(e.target.value)}
              aria-label={t("attendance.filterEmployee")}
            >
              <option value="">{t("attendance.allEmployees")}</option>
              {employees
                .filter((e) => e.employeeProfileId)
                .map((e) => (
                  <option key={e.id} value={e.employeeProfileId!}>
                    {e.fullName}
                  </option>
                ))}
            </select>
          </div>
        ) : null}
      </div>

      <form onSubmit={onSubmit} className="mt-6 flex flex-wrap items-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-700">
        {showEmployeePicker ? (
          <div className="min-w-[12rem] flex-1">
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400" htmlFor="emp-profile">
              {t("attendance.employee")}
            </label>
            <select
              id="emp-profile"
              name="employeeProfileId"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-600 dark:bg-slate-900"
              required
              defaultValue=""
              aria-label={t("attendance.employee")}
            >
              <option value="" disabled>
                {t("attendance.selectEmployee")}
              </option>
              {employees
                .filter((e) => e.employeeProfileId)
                .map((e) => (
                  <option key={e.id} value={e.employeeProfileId!}>
                    {e.fullName}
                  </option>
                ))}
            </select>
          </div>
        ) : null}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400" htmlFor="att-date">
            {t("attendance.day")}
          </label>
          <Input id="att-date" name="attendanceDate" type="date" required className="w-44" />
        </div>
        <label className="flex cursor-pointer items-center gap-2 pt-6 text-sm">
          <input name="isPresent" type="checkbox" defaultChecked className="size-4 rounded border-slate-300" />
          {t("attendance.present")}
        </label>
        <Input
          name="notes"
          placeholder={t("attendance.notesPlaceholder")}
          className="min-w-[10rem] flex-1 max-w-md"
          aria-label={t("attendance.notesPlaceholder")}
        />
        <Button type="submit" disabled={isSaving || (role === "EMPLOYEE" && (meLoading || !meProfile?.employeeProfileId))}>
          {t("attendance.save")}
        </Button>
      </form>

      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("attendance.filterPlaceholder")}
        className="mt-6 max-w-md"
        aria-label={t("attendance.filterPlaceholder")}
      />

      {filtered.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
          {items.length === 0 ? t("attendance.empty") : t("attendance.noMatches")}
        </p>
      ) : (
        <>
          <Table aria-label={t("attendance.tableLabel")} wrapClassName="mt-6">
            <caption className="sr-only">{t("attendance.tableCaption")}</caption>
            <THead>
              <Tr>
                {showEmployeePicker ? <Th>{t("attendance.colEmployee")}</Th> : null}
                <Th>{t("attendance.colDate")}</Th>
                <Th>{t("attendance.colPresent")}</Th>
                <Th>{t("attendance.colNotes")}</Th>
              </Tr>
            </THead>
            <TBody>
              {pageItems.map((x) => (
                <Tr key={x.id}>
                  {showEmployeePicker ? <Td className="font-medium">{x.employeeName}</Td> : null}
                  <Td className="tabular-nums">{x.attendanceDate}</Td>
                  <Td>{x.isPresent ? t("attendance.yes") : t("attendance.no")}</Td>
                  <Td className="max-w-xs truncate">{x.notes ?? "—"}</Td>
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
