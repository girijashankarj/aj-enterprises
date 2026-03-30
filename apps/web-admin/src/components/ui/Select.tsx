import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { inputClassName } from "./Input";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ className, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        inputClassName,
        "appearance-none bg-[linear-gradient(45deg,transparent_50%,var(--color-text-secondary)_50%),linear-gradient(135deg,var(--color-text-secondary)_50%,transparent_50%),var(--color-bg-subtle)] bg-[position:calc(100%-16px)_50%,calc(100%-11px)_50%,0_0] bg-[size:5px_5px,5px_5px,auto] bg-no-repeat pr-8",
        className
      )}
      {...props}
    />
  );
});
