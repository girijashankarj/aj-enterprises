import { cn } from "../../lib/cn";

type Props = { className?: string };

export function Skeleton({ className }: Props) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-[var(--color-bg-subtle)] motion-reduce:animate-none",
        className
      )}
      aria-hidden
    />
  );
}
