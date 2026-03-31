import { SITE } from "../config/site";
import { publicAsset } from "../utils/publicAsset";

type Props = { compact?: boolean };

export function BrandLogo({ compact }: Props) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={publicAsset("/branding/ak-mark.svg")}
        width={40}
        height={40}
        alt={`${SITE.name} mark`}
        className="h-10 w-10 shrink-0 rounded-xl shadow-sm ring-1 ring-[var(--color-border-default)]"
        decoding="async"
      />
      {!compact ? (
        <div className="min-w-0">
          <p className="truncate font-semibold tracking-tight text-[var(--color-text-primary)]">{SITE.name}</p>
          <p className="truncate text-xs text-[var(--color-text-secondary)]">{SITE.tagline}</p>
        </div>
      ) : null}
    </div>
  );
}
