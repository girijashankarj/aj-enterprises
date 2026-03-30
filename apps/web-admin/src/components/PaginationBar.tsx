import { Button } from "./ui/Button";
import { Select } from "./ui/Select";

type Props = {
  page: number;
  pageCount: number;
  setPage: (n: number | ((p: number) => number)) => void;
  pageSize: number;
  setPageSize: (n: number) => void;
  showingLabel: string;
};

export function PaginationBar({ page, pageCount, setPage, pageSize, setPageSize, showingLabel }: Props) {
  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500 dark:text-slate-400">{showingLabel}</p>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          Rows
          <Select
            value={String(pageSize)}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="w-20 py-1.5"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </Select>
        </label>
        <Button type="button" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </Button>
        <span className="text-sm tabular-nums text-slate-600 dark:text-slate-300">
          {page} / {pageCount}
        </span>
        <Button
          type="button"
          variant="secondary"
          disabled={page >= pageCount}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
