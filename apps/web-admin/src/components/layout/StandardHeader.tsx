import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * Shared sticky header chrome (marketing, auth, and app shell) — same border, blur, and max width.
 */
export function StandardHeader({ children }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border-default)] bg-[var(--color-bg-canvas)]/95 shadow-sm backdrop-blur-md">
      <div className="safe-px safe-pt mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 pb-3">
        {children}
      </div>
    </header>
  );
}
