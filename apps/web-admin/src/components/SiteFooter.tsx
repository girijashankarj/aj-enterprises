import { SITE } from "../config/site";

export function SiteFooter() {
  return (
    <footer className="safe-px mt-auto border-t border-[var(--color-border-default)] bg-[var(--color-bg-surface)]/90 py-8 pb-[max(2rem,env(safe-area-inset-bottom,0px))] text-sm text-[var(--color-text-secondary)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md space-y-2">
          <p className="font-medium text-[var(--color-text-primary)]">{SITE.name}</p>
          <p className="text-pretty leading-relaxed">{SITE.description}</p>
          <p className="text-xs text-[var(--color-text-secondary)]">{SITE.location}</p>
        </div>
        <div className="shrink-0 space-y-2 text-xs">
          <p className="font-medium text-[var(--color-text-primary)]">Imagery</p>
          <p>
            Stock photos:{" "}
            <a
              href={SITE.heroPhoto.licenseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-700 underline decoration-sky-700/30 underline-offset-2 hover:decoration-sky-700 dark:text-sky-400"
            >
              Unsplash License
            </a>
            .
          </p>
          <p>Brand banner: generated asset for {SITE.name}.</p>
        </div>
      </div>
    </footer>
  );
}
