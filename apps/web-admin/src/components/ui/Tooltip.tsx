import { cloneElement, isValidElement, useId, type ReactElement } from "react";
import { HelpCircle } from "lucide-react";
import { cn } from "../../lib/cn";

type TooltipProps = {
  label: string;
  /** Shown above (default) or below the trigger */
  side?: "top" | "bottom";
  className?: string;
  children: ReactElement<{ className?: string; "aria-describedby"?: string }>;
};

/**
 * Hover and keyboard focus-within tooltip. Child must be a single focusable control
 * or include a focusable element for keyboard users.
 */
export function Tooltip({ label, side = "bottom", className, children }: TooltipProps) {
  const id = useId();
  if (!isValidElement(children)) {
    return children;
  }
  const position =
    side === "top"
      ? "bottom-full mb-2 top-auto mt-0"
      : "top-full mt-2 bottom-auto mb-0";
  return (
    <span className={cn("group relative inline-flex items-center align-middle", className)}>
      {cloneElement(children, { "aria-describedby": id })}
      <span
        id={id}
        role="tooltip"
        className={cn(
          "pointer-events-none absolute left-1/2 z-50 w-max max-w-[min(16rem,calc(100vw-2rem))] -translate-x-1/2 rounded-md border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] px-2.5 py-1.5 text-left text-xs leading-snug text-[var(--color-text-primary)] shadow-lg opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100",
          position
        )}
      >
        {label}
      </span>
    </span>
  );
}

/** Small help icon; keyboard-focusable for the paired tooltip. */
export function TooltipHint({ label, className }: { label: string; className?: string }) {
  return (
    <Tooltip label={label}>
      <span
        tabIndex={0}
        className={cn(
          "inline-flex cursor-help rounded-full text-[var(--color-text-secondary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]/40",
          className
        )}
      >
        <HelpCircle className="h-4 w-4 shrink-0" aria-hidden />
      </span>
    </Tooltip>
  );
}
