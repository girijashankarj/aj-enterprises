/**
 * Canonical AJ Enterprises branding for web-admin and mobile (Expo).
 * Keep in sync — import from `@aj/shared-types` in both apps.
 */
export const AJ_SITE_BRANDING = {
  name: "AJ Enterprises",
  shortName: "AJ",
  tagline: "Manufacturing operations platform",
  /** Subheader on mobile; matches web workshop positioning. */
  mobileTagline: "Metal press & lathe · Bhosari MIDC, Pune",
  description:
    "AJ Enterprises — metal press, lathe, and machine workshop operations in Bhosari (MIDC), Pune: production task planning, live progress, employees, salary ledger, and leave tracking in one place.",
  location: "Bhosari, Pune, India",
  locationDetail: "Bhosari MIDC, Pune"
} as const;

export type AjSiteBranding = typeof AJ_SITE_BRANDING;
