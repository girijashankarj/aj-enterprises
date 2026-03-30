import { useCallback, useEffect } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { dismissToast } from "../store/slices/toastSlice";
import { cn } from "../lib/cn";

export function ToastHost() {
  const items = useAppSelector((s) => s.toast.items);

  return (
    <div
      className="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom,0px))] right-[max(1rem,env(safe-area-inset-right,0px))] z-[100] flex max-w-[min(100vw-2rem,24rem)] flex-col gap-2 p-0"
      aria-live="polite"
      aria-relevant="additions text"
    >
      {items.map((t) => (
        <ToastItem key={t.id} id={t.id} message={t.message} tone={t.tone} />
      ))}
    </div>
  );
}

function ToastItem({
  id,
  message,
  tone
}: {
  id: string;
  message: string;
  tone: "success" | "error" | "info";
}) {
  const dispatch = useAppDispatch();
  const onDismiss = useCallback(() => {
    dispatch(dismissToast(id));
  }, [dispatch, id]);

  useEffect(() => {
    const t = window.setTimeout(onDismiss, 4500);
    return () => window.clearTimeout(t);
  }, [id, onDismiss]);

  const Icon =
    tone === "success" ? CheckCircle2 : tone === "error" ? XCircle : Info;

  return (
    <div
      className={cn(
        "pointer-events-auto rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] px-4 py-3 text-sm shadow-lg motion-safe:transition motion-safe:duration-200",
        tone === "success" && "text-[var(--color-text-primary)]",
        tone === "error" && "text-[var(--color-text-primary)]",
        tone === "info" && "text-[var(--color-text-primary)]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-2.5">
          <Icon
            className={cn(
              "mt-0.5 h-5 w-5 shrink-0",
              tone === "success" && "text-[var(--color-success)]",
              tone === "error" && "text-[var(--color-error)]",
              tone === "info" && "text-[var(--color-info)]"
            )}
            aria-hidden
          />
          <p className="min-w-0 leading-snug">{message}</p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-lg p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]"
          onClick={() => dispatch(dismissToast(id))}
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
