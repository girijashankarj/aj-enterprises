import { type FormEvent, useMemo, useState } from "react";
import { useGetLeaveQuery } from "../store/api/akApi";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addLeaveRequest } from "../store/slices/leaveSlice";
import { pushToast } from "../store/slices/toastSlice";
import { Card, CardDescription, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Alert";
import { Table, TBody, Td, Th, THead, Tr } from "../components/ui/Table";
import { Spinner } from "../components/ui/Spinner";
import { PaginationBar } from "../components/PaginationBar";
import { usePagination } from "../hooks/usePagination";

export default function LeavePage() {
  const dispatch = useAppDispatch();
  const role = useAppSelector((s) => s.auth.role);
  const email = useAppSelector((s) => s.auth.email);
  const { data: requests = [], isLoading, isError, refetch } = useGetLeaveQuery();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const identity = email?.split("@")[0]?.toLowerCase() ?? "";
    const scoped = role === "EMPLOYEE" ? requests.filter((r) => r.employeeName.toLowerCase().includes(identity)) : requests;
    const s = q.trim().toLowerCase();
    if (!s) return scoped;
    return scoped.filter(
      (r) => r.employeeName.toLowerCase().includes(s) || r.status.toLowerCase().includes(s)
    );
  }, [requests, q, role, email]);

  const { page, setPage, pageSize, setPageSize, pageItems, pageCount, showingLabel } = usePagination(filtered, 10);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    dispatch(
      addLeaveRequest({
        id: crypto.randomUUID(),
        employeeName: role === "EMPLOYEE" ? (email?.split("@")[0] ?? "Employee") : String(form.get("employeeName")),
        fromDate: String(form.get("fromDate")),
        toDate: String(form.get("toDate")),
        status: "PENDING"
      })
    );
    dispatch(pushToast({ message: "Leave request added", tone: "success" }));
    e.currentTarget.reset();
  };

  if (isLoading) {
    return (
      <Card className="flex min-h-[12rem] items-center justify-center">
        <Spinner label="Loading leave requests" />
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert tone="error" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>Could not load leave data.</span>
        <Button type="button" variant="secondary" onClick={() => void refetch()}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <Card>
      <CardTitle>Leave tracking</CardTitle>
      <CardDescription>Requests and status.</CardDescription>
      <form onSubmit={onSubmit} className="mt-4 flex flex-wrap gap-2">
        {role !== "EMPLOYEE" ? (
          <Input name="employeeName" placeholder="Employee" required className="min-w-[10rem] flex-1" />
        ) : null}
        <Input name="fromDate" type="date" required className="w-44" aria-label="From date" />
        <Input name="toDate" type="date" required className="w-44" aria-label="To date" />
        <Button type="submit">Add request</Button>
      </form>

      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Filter by employee or status…"
        className="mt-6 max-w-md"
        aria-label="Filter leave requests"
      />

      {filtered.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
          {requests.length === 0 ? "No leave requests yet." : "No matches for your search."}
        </p>
      ) : (
        <>
          <Table aria-label="Leave requests" wrapClassName="mt-6">
            <caption className="sr-only">Employee leave with dates and status</caption>
            <THead>
              <Tr>
                {role !== "EMPLOYEE" ? <Th>Employee</Th> : null}
                <Th>From</Th>
                <Th>To</Th>
                <Th>Status</Th>
              </Tr>
            </THead>
            <TBody>
              {pageItems.map((x) => (
                <Tr key={x.id}>
                  {role !== "EMPLOYEE" ? <Td className="font-medium">{x.employeeName}</Td> : null}
                  <Td className="tabular-nums">{x.fromDate}</Td>
                  <Td className="tabular-nums">{x.toDate}</Td>
                  <Td>{x.status}</Td>
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
