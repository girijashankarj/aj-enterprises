import { cn } from "../../lib/cn";

type Props = { className?: string; label?: string };

export function Spinner({ className, label = "Loading" }: Props) {
  return (
    <span role="status" aria-live="polite" className={cn("inline-flex items-center gap-2", className)}>
      <span
        className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-border-default)] border-t-[var(--color-brand-primary)] motion-reduce:animate-none"
        aria-hidden
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
