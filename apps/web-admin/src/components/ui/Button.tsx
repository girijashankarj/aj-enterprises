import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

const variants = {
  primary:
    "bg-[var(--color-brand-primary)] text-white shadow-sm hover:brightness-95 focus-visible:ring-[var(--color-brand-primary)]/40",
  secondary:
    "border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] shadow-sm hover:bg-[var(--color-bg-subtle)]",
  danger: "bg-[var(--color-error)] text-white hover:brightness-95 focus-visible:ring-[var(--color-error)]/40",
  ghost: "text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]",
  success:
    "bg-[var(--color-success)] text-white shadow-sm hover:brightness-95 focus-visible:ring-[var(--color-success)]/40"
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-[colors,box-shadow,filter] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-surface)] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
