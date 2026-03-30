import { type FormEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FileDown, FileText } from "lucide-react";
import { useGetFinanceQuery } from "../store/api/akApi";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addLedgerEntry } from "../store/slices/financeSlice";
import { pushToast } from "../store/slices/toastSlice";
import { Card, CardDescription, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Alert } from "../components/ui/Alert";
import { Table, TBody, Td, Th, THead, Tr } from "../components/ui/Table";
import { Spinner } from "../components/ui/Spinner";
import { PaginationBar } from "../components/PaginationBar";
import { usePagination } from "../hooks/usePagination";
import { downloadCsv } from "../utils/exportCsv";
import { downloadPdfViaPrint } from "../utils/exportPdf";

export default function FinancePage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const role = useAppSelector((s) => s.auth.role);
  const email = useAppSelector((s) => s.auth.email);
  const { data: entries = [], isLoading, isError, refetch } = useGetFinanceQuery();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const identity = email?.split("@")[0]?.toLowerCase() ?? "";
    const scoped = role === "EMPLOYEE" ? entries.filter((e) => e.employeeName.toLowerCase().includes(identity)) : entries;
    const s = q.trim().toLowerCase();
    if (!s) return scoped;
    return scoped.filter((e) => e.employeeName.toLowerCase().includes(s) || e.type.toLowerCase().includes(s));
  }, [entries, q, role, email]);

  const { page, setPage, pageSize, setPageSize, pageItems, pageCount, showingLabel } = usePagination(filtered, 10);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    dispatch(
      addLedgerEntry({
        id: crypto.randomUUID(),
        employeeName: String(form.get("employeeName")),
        type: String(form.get("type")) as "ADVANCE" | "CREDIT" | "PENDING",
        amount: Number(form.get("amount"))
      })
    );
    dispatch(pushToast({ message: "Ledger entry added", tone: "success" }));
    e.currentTarget.reset();
  };

  if (isLoading) {
    return (
      <Card className="flex min-h-[12rem] items-center justify-center">
        <Spinner label="Loading finance data" />
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert tone="error" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>Could not load ledger.</span>
        <Button type="button" variant="secondary" onClick={() => void refetch()}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <Card>
      <CardTitle>Salary, advance &amp; pending</CardTitle>
      <CardDescription>Ledger entries for payroll context.</CardDescription>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          className="gap-2"
          onClick={() => {
            if (filtered.length === 0) {
              dispatch(pushToast({ message: t("finance.toastCsvEmpty"), tone: "info" }));
              return;
            }
            downloadCsv("salary-ledger.csv", filtered);
            dispatch(pushToast({ message: t("finance.toastCsvExported"), tone: "success" }));
          }}
        >
          <FileDown className="h-4 w-4 shrink-0" aria-hidden />
          Export CSV
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="gap-2"
          onClick={() => {
            downloadPdfViaPrint("salary-ledger");
            dispatch(pushToast({ message: t("finance.toastPrintOpened"), tone: "info" }));
          }}
        >
          <FileText className="h-4 w-4 shrink-0" aria-hidden />
          Export PDF
        </Button>
      </div>
      {role !== "EMPLOYEE" ? (
        <form onSubmit={onSubmit} className="mt-4 flex flex-wrap gap-2">
          <Input name="employeeName" placeholder="Employee" required className="min-w-[10rem] flex-1" />
          <Select name="type" className="w-36" aria-label="Entry type">
            <option>ADVANCE</option>
            <option>CREDIT</option>
            <option>PENDING</option>
          </Select>
          <Input name="amount" type="number" placeholder="Amount (Rs.)" required className="min-w-[8rem]" />
          <Button type="submit">Add entry</Button>
        </form>
      ) : null}

      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Filter by employee or type…"
        className="mt-6 max-w-md"
        aria-label="Filter ledger"
      />

      {filtered.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
          {entries.length === 0 ? "No entries yet." : "No matches for your search."}
        </p>
      ) : (
        <>
          <Table aria-label="Finance ledger" wrapClassName="mt-6">
            <caption className="sr-only">Salary advances and credits</caption>
            <THead>
              <Tr>
                <Th>Employee</Th>
                <Th>Type</Th>
                <Th className="text-right">Amount (Rs.)</Th>
              </Tr>
            </THead>
            <TBody>
              {pageItems.map((x) => (
                <Tr key={x.id}>
                  <Td className="font-medium">{x.employeeName}</Td>
                  <Td>{x.type}</Td>
                  <Td className="text-right tabular-nums">{x.amount}</Td>
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
