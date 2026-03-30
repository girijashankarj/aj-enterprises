import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";

type NavItem = readonly [string, string];

type Props = {
  open: boolean;
  onClose: () => void;
  navItems: readonly NavItem[];
  titleId: string;
};

export function MobileNavDrawer({ open, onClose, navItems, titleId }: Props) {
  const { t } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);
  const prevActive = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    prevActive.current = document.activeElement as HTMLElement;
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) return;
    prevActive.current?.focus?.();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-sm motion-safe:transition-opacity motion-reduce:transition-none"
        aria-label={t("common.closeMenu", "Close menu")}
        onClick={onClose}
      />
      <div
        id="mobile-nav-drawer"
        ref={panelRef}
        className="absolute left-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-r border-[var(--color-border-default)] bg-[var(--color-bg-surface)] pt-[env(safe-area-inset-top,0px)] pl-[env(safe-area-inset-left,0px)] shadow-xl motion-safe:transition-transform motion-safe:duration-200"
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border-default)] px-4 py-3">
          <p id={titleId} className="font-semibold text-[var(--color-text-primary)]">
            {t("common.menu", "Menu")}
          </p>
          <Button type="button" variant="ghost" className="min-h-10 min-w-10 px-0" onClick={onClose} aria-label={t("common.close", "Close")}>
            ×
          </Button>
        </div>
        <nav className="flex flex-col gap-1 p-2" aria-label={t("common.primaryNav", "Primary")}>
          {navItems.map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2.5 text-sm font-medium ${
                  isActive
                    ? "bg-[var(--color-brand-primary)] text-white"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)]"
                }`
              }
            >
              {t(label)}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

