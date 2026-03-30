import { type FormEvent, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ClipboardList, Plus, Search, UserCheck } from "lucide-react";
import { useGetEmployeesQuery, useGetTasksQuery } from "../store/api/akApi";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { assignTask, updateTaskCount } from "../store/slices/tasksSlice";
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

export default function TasksPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const role = useAppSelector((s) => s.auth.role);
  const { data: tasks = [], isLoading, isError, refetch } = useGetTasksQuery();
  const { data: roster = [] } = useGetEmployeesQuery(undefined, { skip: role === "EMPLOYEE" });
  const [issueByTask, setIssueByTask] = useState<Record<string, string>>({});
  const [q, setQ] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<Set<string>>(() => new Set());

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const scoped = role === "EMPLOYEE" ? tasks.filter((t) => t.employeeName) : tasks;
    if (!s) return scoped;
    return scoped.filter(
      (t) =>
        t.employeeName.toLowerCase().includes(s) ||
        t.partNumber.toLowerCase().includes(s) ||
        t.partName.toLowerCase().includes(s)
    );
  }, [tasks, q, role]);

  const { page, setPage, pageSize, setPageSize, pageItems, pageCount, showingLabel } = usePagination(filtered, 10);

  const rosterFiltered = useMemo(() => {
    const s = assigneeFilter.trim().toLowerCase();
    if (!s) return roster;
    return roster.filter(
      (emp) =>
        emp.fullName.toLowerCase().includes(s) || emp.email.toLowerCase().includes(s)
    );
  }, [roster, assigneeFilter]);

  const toggleAssignee = useCallback((id: string) => {
    setSelectedAssigneeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAllFiltered = useCallback(() => {
    setSelectedAssigneeIds((prev) => {
      const next = new Set(prev);
      for (const e of rosterFiltered) next.add(e.id);
      return next;
    });
  }, [rosterFiltered]);

  const clearAssigneeSelection = useCallback(() => setSelectedAssigneeIds(new Set()), []);

  const onAssign = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const selected = roster.filter((emp) => selectedAssigneeIds.has(emp.id));
    if (selected.length === 0) {
      dispatch(pushToast({ message: t("tasks.toastPickEmployees"), tone: "error" }));
      return;
    }
    const partNumber = String(form.get("partNumber"));
    const partName = String(form.get("partName"));
    const targetCount = Number(form.get("targetCount"));
    for (const emp of selected) {
      dispatch(
        assignTask({
          id: crypto.randomUUID(),
          employeeName: emp.fullName,
          partNumber,
          partName,
          targetCount,
          achievedCount: 0
        })
      );
    }
    dispatch(pushToast({ message: t("tasks.toastAssignedMany", { count: selected.length }), tone: "success" }));
    e.currentTarget.reset();
    setSelectedAssigneeIds(new Set());
  };

  const bump = (taskId: string) => {
    const issue = issueByTask[taskId]?.trim();
    dispatch(updateTaskCount({ id: taskId, increment: 50, issueNotes: issue || undefined }));
    dispatch(pushToast({ message: t("tasks.toastProgressUpdated"), tone: "success" }));
  };

  if (isLoading) {
    return (
      <Card className="flex min-h-[12rem] items-center justify-center">
        <Spinner label="Loading tasks" />
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert tone="error" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>Could not load tasks.</span>
        <Button type="button" variant="secondary" onClick={() => void refetch()}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {role !== "EMPLOYEE" ? (
        <Card>
          <div className="flex flex-wrap items-start gap-3">
            <ClipboardList className="mt-0.5 h-8 w-8 shrink-0 text-[var(--color-brand-primary)]" aria-hidden />
            <div>
              <CardTitle className="flex items-center gap-2">
                Assign weekly task
                <TooltipHint label={t("tasks.assignSelectHint")} />
              </CardTitle>
              <CardDescription>Part-level targets for batch-oriented work.</CardDescription>
            </div>
          </div>
          <form onSubmit={onAssign} className="mt-4 space-y-4">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <UserCheck className="h-4 w-4 text-[var(--color-brand-primary)]" aria-hidden />
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  {t("tasks.assignSelectEmployees")}
                </span>
                {selectedAssigneeIds.size > 0 ? (
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    ({selectedAssigneeIds.size} {selectedAssigneeIds.size === 1 ? "selected" : "selected"})
                  </span>
                ) : null}
              </div>
              <div className="relative mb-2 max-w-md">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-secondary)]"
                  aria-hidden
                />
                <Input
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                  placeholder={t("tasks.assignSearchRoster")}
                  className="pl-9"
                  aria-label={t("tasks.assignSearchRoster")}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="secondary" className="text-xs" onClick={selectAllFiltered}>
                  Select all in list
                </Button>
                <Button type="button" variant="ghost" className="text-xs" onClick={clearAssigneeSelection}>
                  Clear selection
                </Button>
              </div>
              <div
                className="mt-3 max-h-44 overflow-y-auto rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-2"
                role="group"
                aria-label={t("tasks.assignSelectEmployees")}
              >
                {rosterFiltered.length === 0 ? (
                  <p className="px-2 py-4 text-center text-sm text-[var(--color-text-secondary)]">
                    {roster.length === 0 ? "No employees on roster yet." : "No matches."}
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {rosterFiltered.map((emp) => (
                      <li key={emp.id}>
                        <label
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm transition hover:bg-[var(--color-bg-subtle)]",
                            selectedAssigneeIds.has(emp.id) && "bg-[var(--color-bg-subtle)]"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={selectedAssigneeIds.has(emp.id)}
                            onChange={() => toggleAssignee(emp.id)}
                            className="h-4 w-4 rounded border-[var(--color-border-default)] text-[var(--color-brand-primary)] focus:ring-2 focus:ring-[var(--color-brand-primary)]/40"
                          />
                          <span className="font-medium text-[var(--color-text-primary)]">{emp.fullName}</span>
                          <span className="truncate text-xs text-[var(--color-text-secondary)]">{emp.email}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              <Input name="partNumber" placeholder="Part no." required />
              <Input name="partName" placeholder="Part name" required />
              <Input name="targetCount" type="number" placeholder="Target count" required />
              <Tooltip label={t("tasks.assignSelectHint")}>
                <Button type="submit" className="w-full gap-2">
                  <Plus className="h-4 w-4 shrink-0" aria-hidden />
                  Assign
                </Button>
              </Tooltip>
            </div>
          </form>
        </Card>
      ) : null}

      <Card>
        <div className="flex flex-wrap items-start gap-3">
          <ClipboardList className="mt-0.5 h-7 w-7 shrink-0 text-[var(--color-brand-primary)]" aria-hidden />
          <div>
            <CardTitle>Live progress</CardTitle>
            <CardDescription>Filter by employee or part. Use +50 to record shop-floor progress.</CardDescription>
          </div>
        </div>
        <div className="relative mt-4 max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-secondary)]"
            aria-hidden
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter by employee, part no., or name…"
            className="pl-9"
            aria-label="Filter tasks"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
            {tasks.length === 0 ? "No tasks yet. Assign one above." : "No matches for your search."}
          </p>
        ) : (
          <>
            <div className="mt-6 hidden md:block">
              <Table aria-label="Task assignments and progress">
                <caption className="sr-only">Weekly tasks with progress and update actions</caption>
                <THead>
                  <Tr>
                    <Th>Employee</Th>
                    <Th>Part</Th>
                    <Th className="text-right">Achieved / Target</Th>
                    <Th>Update</Th>
                  </Tr>
                </THead>
                <TBody>
                  {pageItems.map((task) => (
                    <Tr key={task.id}>
                      <Td className="font-medium">{task.employeeName}</Td>
                      <Td>
                        <span className="font-mono text-sm">{task.partNumber}</span> — {task.partName}
                      </Td>
                      <Td className="text-right tabular-nums">
                        {task.achievedCount} / {task.targetCount}
                      </Td>
                      <Td>
                        <div className="flex min-w-[14rem] flex-col gap-2 sm:flex-row sm:items-center">
                          <Button type="button" variant="success" className="min-h-10 shrink-0 px-3" onClick={() => bump(task.id)}>
                            +50
                          </Button>
                          <Input
                            value={issueByTask[task.id] ?? ""}
                            onChange={(e) =>
                              setIssueByTask((m) => ({ ...m, [task.id]: e.target.value }))
                            }
                            placeholder="Issue note"
                            className="min-h-10 py-1.5 text-sm"
                            aria-label={`Issue note for ${task.partNumber}`}
                          />
                        </div>
                        {task.issueNotes ? (
                          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">Issue: {task.issueNotes}</p>
                        ) : null}
                      </Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>
            </div>

            <ul className="mt-6 space-y-4 md:hidden">
              {pageItems.map((task) => (
                <li key={task.id} className="rounded-xl border border-slate-100 p-4 dark:border-slate-700">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {task.employeeName} — {task.partNumber} ({task.partName})
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {task.achievedCount} / {task.targetCount} achieved
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button type="button" variant="success" onClick={() => bump(task.id)}>
                      +50 update
                    </Button>
                    <Input
                      value={issueByTask[task.id] ?? ""}
                      onChange={(e) => setIssueByTask((m) => ({ ...m, [task.id]: e.target.value }))}
                      placeholder="Issue note (optional)"
                      className="min-w-[12rem]"
                    />
                  </div>
                  {task.issueNotes ? (
                    <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">Issue: {task.issueNotes}</p>
                  ) : null}
                </li>
              ))}
            </ul>

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
    </div>
  );
}
