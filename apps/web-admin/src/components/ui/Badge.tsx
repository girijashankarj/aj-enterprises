import { type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type Props = HTMLAttributes<HTMLSpanElement> & { tone?: "sky" | "amber" | "neutral" };

const tones = {
  sky: "bg-[var(--color-bg-subtle)] text-[var(--color-info)]",
  amber: "bg-[var(--color-bg-subtle)] text-[var(--color-warning)]",
  neutral: "bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)]"
} as const;

export function Badge({ className, tone = "neutral", ...props }: Props) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone], className)}
      {...props}
    />
  );
}
