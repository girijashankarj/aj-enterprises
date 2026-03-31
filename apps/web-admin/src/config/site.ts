/** Public site copy, SEO, and licensed imagery references (web-admin). */

export const SITE = {
  name: "AJ Enterprises",
  shortName: "AJ",
  tagline: "Manufacturing operations platform",
  description:
    "AJ Enterprises — metal press, lathe, and machine workshop operations in Bhosari (MIDC), Pune: production task planning, live progress, employees, salary ledger, and leave tracking in one place.",
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
  /** Metal press / fabrication context — distinct stock imagery (Unsplash). */
  bannerPath:
    "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1280&q=82",
  /** Open-licensed stock (Unsplash License — https://unsplash.com/license). */
  heroPhoto: {
    src: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1800&q=82",
    alt: "Metal fabrication and welding in an industrial press and machine workshop",
    licenseUrl: "https://unsplash.com/license"
  },
  secondaryPhoto: {
    src: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1200&q=82",
    alt: "Industrial workshop floor — MIDC-style metal and production environment",
    licenseUrl: "https://unsplash.com/license"
  }
} as const;

export function pageTitle(segment: string): string {
  return segment === SITE.name ? SITE.name : `${segment} · ${SITE.name}`;
}
