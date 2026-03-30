import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleTheme } from "../../store/slices/themeSlice";
import { setUserLanguage } from "../../store/slices/preferencesSlice";
import type { SupportedLanguage } from "../../store/slices/preferencesSlice";

/** Matches secondary `Button` + toolbar row: same height, surface, border, shadow, radius. Chevron stack matches `Select` (surface instead of subtle). */
const headerSelectClassName =
  "h-11 w-[7.25rem] min-w-[7rem] shrink-0 appearance-none rounded-lg border border-[var(--color-border-default)] bg-[linear-gradient(45deg,transparent_50%,var(--color-text-secondary)_50%),linear-gradient(135deg,var(--color-text-secondary)_50%,transparent_50%),var(--color-bg-surface)] bg-[position:calc(100%-16px)_50%,calc(100%-11px)_50%,0_0] bg-[size:5px_5px,5px_5px,auto] bg-no-repeat px-3 py-0 pr-8 text-sm font-medium text-[var(--color-text-primary)] shadow-sm focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20";

export function HeaderControls() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((s) => s.theme.mode);
  const language = useAppSelector(
    (s) => s.preferences.userOverrides.language ?? s.preferences.orgDefaults.language
  );

  return (
    <div className="inline-flex items-center gap-2">
      <Select
        aria-label={t("common.language", "Language")}
        className={headerSelectClassName}
        value={language}
        onChange={(e) => dispatch(setUserLanguage(e.target.value as SupportedLanguage))}
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="mr">Marathi</option>
      </Select>
      <Button
        type="button"
        variant="secondary"
        className="h-11 w-11 shrink-0 p-0"
        onClick={() => dispatch(toggleTheme())}
        aria-label={
          themeMode === "dark"
            ? t("common.switchToLight", "Switch to light theme")
            : t("common.switchToDark", "Switch to dark theme")
        }
        title={
          themeMode === "dark"
            ? t("common.switchToLight", "Switch to light theme")
            : t("common.switchToDark", "Switch to dark theme")
        }
      >
        {themeMode === "dark" ? (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
            />
          </svg>
        )}
      </Button>
    </div>
  );
}
