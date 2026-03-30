import { type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type TableProps = HTMLAttributes<HTMLTableElement> & { wrapClassName?: string };

export function Table({ className, wrapClassName, ...props }: TableProps) {
  return (
    <div
      className={cn(
        "touch-pan-x overflow-x-auto overscroll-x-contain rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] shadow-sm [-webkit-overflow-scrolling:touch]",
        wrapClassName
      )}
    >
      <table className={cn("w-full min-w-[32rem] border-collapse text-left text-sm", className)} {...props} />
    </div>
  );
}

export function THead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("border-b border-[var(--color-border-default)] bg-[var(--color-bg-subtle)]", className)}
      {...props}
    />
  );
}

export function TBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-[var(--color-border-default)]", className)} {...props} />;
}

export function Tr({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("hover:bg-[var(--color-bg-subtle)]", className)} {...props} />;
}

export function Th({ className, scope = "col", ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope={scope}
      className={cn("px-4 py-3 font-semibold text-[var(--color-text-secondary)]", className)}
      {...props}
    />
  );
}

export function Td({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-3 text-[var(--color-text-primary)]", className)} {...props} />;
}
