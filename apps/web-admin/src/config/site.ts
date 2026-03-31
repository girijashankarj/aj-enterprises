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
