/** Public site copy, SEO, and licensed imagery references (web-admin). */

export const SITE = {
  name: "AJ Enterprises",
  shortName: "AJ",
  tagline: "Manufacturing operations platform",
  description:
    "AJ Enterprises — workshop operations in Bhosari, Pune: production task planning, live progress, employees, salary ledger, and leave tracking in one place.",
  keywords: [
    "AJ Enterprises",
    "Bhosari",
    "Pune",
    "manufacturing",
    "shop floor",
    "task planning",
    "production tracking",
    "payroll",
    "leave management"
  ].join(", "),
  locale: "en_IN",
  location: "Bhosari, Pune, India",
  bannerPath: "/branding/ak-enterprises-banner.png",
  /** Open-licensed stock (Unsplash License — https://unsplash.com/license). */
  heroPhoto: {
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1800&q=82",
    alt: "Technician using equipment in a precision manufacturing workshop",
    licenseUrl: "https://unsplash.com/license"
  },
  secondaryPhoto: {
    src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=82",
    alt: "Industrial machinery and manufacturing floor context",
    licenseUrl: "https://unsplash.com/license"
  }
} as const;

export function pageTitle(segment: string): string {
  return segment === SITE.name ? SITE.name : `${segment} · ${SITE.name}`;
}
