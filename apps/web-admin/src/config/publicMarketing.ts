/**
 * Public marketing copy and contact defaults for the unauthenticated landing page.
 * Override social/contact URLs via Vite env (see `vite-env.d.ts`).
 */

export const PUBLIC_MARKETING = {
  owner: {
    name: "Akash Joshi",
    title: "Owner"
  },
  workshop: {
    headline: "Precision machining for leading OEMs",
    employees: "50+ employees",
    shifts: "Day and night rotation shifts",
    experience: "10+ years of operations"
  },
  services: [
    {
      title: "Lathe machines",
      description: "Turning and finishing across part families with repeatable quality."
    },
    {
      title: "Pressure machines",
      description: "Hydraulic and pressure-based processes tuned for your tonnage and cycle time."
    },
    {
      title: "Torque machines",
      description: "Multiple tonnage capacities and tooling for varied production runs."
    }
  ],
  clients: ["Whirlpool", "LG", "Voltas"] as const
} as const;

/** Fallbacks when env is unset (GitHub Pages). Each URL must stay on its own platform — override via repo Variables or `.env`. */
export const DEFAULT_PUBLIC_SOCIAL = {
  youtube: "https://www.youtube.com/",
  instagram: "https://www.instagram.com/",
  linkedin: "https://www.linkedin.com/"
} as const;

function envOr(v: string | undefined, fallback: string): string {
  if (typeof v !== "string") return fallback;
  const t = v.trim();
  return t === "" ? fallback : t;
}

export function getPublicContact() {
  return {
    email: import.meta.env.VITE_PUBLIC_CONTACT_EMAIL ?? "contact@ajenterprises.in",
    phone: import.meta.env.VITE_PUBLIC_CONTACT_PHONE ?? "+91 —",
    address:
      import.meta.env.VITE_PUBLIC_CONTACT_ADDRESS ?? "Bhosari, Pune, Maharashtra, India"
  };
}

export function getSocialUrls() {
  return {
    youtube: envOr(import.meta.env.VITE_PUBLIC_YOUTUBE_URL, DEFAULT_PUBLIC_SOCIAL.youtube),
    instagram: envOr(import.meta.env.VITE_PUBLIC_INSTAGRAM_URL, DEFAULT_PUBLIC_SOCIAL.instagram),
    linkedin: envOr(import.meta.env.VITE_PUBLIC_LINKEDIN_URL, DEFAULT_PUBLIC_SOCIAL.linkedin),
    x: import.meta.env.VITE_PUBLIC_X_URL?.trim() ?? ""
  };
}
