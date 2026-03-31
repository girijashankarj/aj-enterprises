/** Public site copy, SEO, and licensed imagery references (web-admin). */

import { AJ_SITE_BRANDING } from "@aj/shared-types";

export const SITE = {
  ...AJ_SITE_BRANDING,
  keywords: [
    "AJ Enterprises",
    "Bhosari",
    "MIDC",
    "Pune",
    "manufacturing",
    "metal press",
    "shop floor",
    "task planning",
    "production tracking",
    "payroll",
    "leave management"
  ].join(", "),
  locale: "en_IN",
  /** Metal press / fabrication context — distinct stock imagery (Unsplash). */
  bannerPath:
    "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1280&q=82",
  /** Open-licensed stock (Unsplash License — https://unsplash.com/license). */
  heroPhoto: {
    src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1800&q=82",
    alt: "Modern industrial machinery and fabrication workspace in operation",
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
