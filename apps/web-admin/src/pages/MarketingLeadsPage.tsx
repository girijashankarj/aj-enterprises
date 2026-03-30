import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetMarketingLeadsQuery } from "../store/api/akApi";
import { Card, CardDescription, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";
import { Table, TBody, Td, Th, THead, Tr } from "../components/ui/Table";
import { Spinner } from "../components/ui/Spinner";
import { PaginationBar } from "../components/PaginationBar";
import type { PublicLeadRow } from "../store/api/akApi";

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    });
  } catch {
    return iso;
  }
}

function utmSummary(row: PublicLeadRow): string {
  const parts = [row.utmSource, row.utmMedium, row.utmCampaign].filter(Boolean);
  return parts.length ? parts.join(" / ") : "—";
}

export default function MarketingLeadsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const { data, isLoading, isError, refetch } = useGetMarketingLeadsQuery({ page, limit: pageSize });

  const rows = data?.items ?? [];
  const total = data?.total ?? 0;

  const pageCount = Math.max(1, Math.ceil(total / pageSize) || 1);

  const showingLabel = useMemo(() => {
    if (total === 0) return t("marketingLeads.showingNone");
    const from = (page - 1) * pageSize + 1;
    const to = Math.min(total, page * pageSize);
    return t("marketingLeads.showingRange", { from, to, total });
  }, [total, page, pageSize, t]);

  if (isLoading) {
    return (
      <Card className="flex min-h-[12rem] items-center justify-center">
        <Spinner label={t("marketingLeads.loading")} />
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Alert tone="error" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>{t("marketingLeads.loadError")}</span>
        <Button type="button" variant="secondary" onClick={() => void refetch()}>
          {t("common.retry")}
        </Button>
      </Alert>
    );
  }

  return (
    <Card>
      <CardTitle>{t("marketingLeads.title")}</CardTitle>
      <CardDescription>{t("marketingLeads.description")}</CardDescription>

      {total === 0 ? (
        <p className="mt-6 text-sm text-[var(--color-text-secondary)]">{t("marketingLeads.empty")}</p>
      ) : (
        <>
          <Table wrapClassName="mt-4" aria-label={t("marketingLeads.tableLabel")}>
              <THead>
                <Tr>
                  <Th>{t("marketingLeads.colWhen")}</Th>
                  <Th>{t("marketingLeads.colName")}</Th>
                  <Th>{t("marketingLeads.colEmail")}</Th>
                  <Th>{t("marketingLeads.colSubject")}</Th>
                  <Th>{t("marketingLeads.colUtm")}</Th>
                  <Th>{t("marketingLeads.colMessage")}</Th>
                </Tr>
              </THead>
              <TBody>
                {rows.map((row) => (
                  <Tr key={row.id}>
                    <Td className="whitespace-nowrap text-xs">{formatWhen(row.createdAt)}</Td>
                    <Td>{row.name}</Td>
                    <Td className="max-w-[10rem] truncate text-sm">{row.email}</Td>
                    <Td className="max-w-[12rem] truncate">{row.subject}</Td>
                    <Td className="max-w-[8rem] truncate text-xs text-[var(--color-text-secondary)]">
                      {utmSummary(row)}
                    </Td>
                    <Td className="max-w-[min(28rem,50vw)]">
                      <details className="text-sm">
                        <summary className="cursor-pointer text-[var(--color-brand-primary)]">
                          {t("marketingLeads.viewMessage")}
                        </summary>
                        <p className="mt-2 whitespace-pre-wrap text-[var(--color-text-secondary)]">{row.message}</p>
                        {row.pageUrl ? (
                          <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                            {t("marketingLeads.pageUrl")}: {row.pageUrl}
                          </p>
                        ) : null}
                      </details>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>

          <PaginationBar
            page={page}
            pageCount={pageCount}
            setPage={setPage}
            pageSize={pageSize}
            setPageSize={(n) => {
              setPageSize(n);
              setPage(1);
            }}
            showingLabel={showingLabel}
          />
        </>
      )}
    </Card>
  );
}
