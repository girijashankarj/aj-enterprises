import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export const inputClassName =
  "min-h-11 w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(inputClassName, className)} {...props} />;
});
