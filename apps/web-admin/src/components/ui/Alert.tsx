import { type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type Tone = "info" | "error" | "success";

const tones: Record<Tone, string> = {
  info: "border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] text-[var(--color-info)]",
  error: "border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] text-[var(--color-error)]",
  success: "border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] text-[var(--color-success)]"
};

type Props = HTMLAttributes<HTMLDivElement> & { tone?: Tone };

export function Alert({ className, tone = "info", ...props }: Props) {
  return (
    <div
      role="alert"
      className={cn("rounded-xl border px-4 py-3 text-sm", tones[tone], className)}
      {...props}
    />
  );
}
