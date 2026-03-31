/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCK_API?: string;
  readonly VITE_API_BASE_URL?: string;
  /** Google OAuth client ID (must match API `GOOGLE_CLIENT_ID`) when using real sign-in */
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  /** Dev-only: `admin` (default) or `employee` — narrows nav for employee-style UI preview */
  readonly VITE_DEV_ROLE?: string;
  readonly VITE_WORKSHOP_NAME?: string;
  readonly VITE_WORKSHOP_LATITUDE?: string;
  readonly VITE_WORKSHOP_LONGITUDE?: string;
  readonly VITE_WORKSHOP_MAP_URL?: string;
  readonly VITE_WORKSHOP_MAP_EMBED_URL?: string;
  /** Public landing: social links (optional; defaults keep YouTube/Instagram/LinkedIn on the correct host) */
  readonly VITE_PUBLIC_YOUTUBE_URL?: string;
  readonly VITE_PUBLIC_INSTAGRAM_URL?: string;
  readonly VITE_PUBLIC_LINKEDIN_URL?: string;
  readonly VITE_PUBLIC_X_URL?: string;
  readonly VITE_PUBLIC_CONTACT_EMAIL?: string;
  readonly VITE_PUBLIC_CONTACT_PHONE?: string;
  readonly VITE_PUBLIC_CONTACT_ADDRESS?: string;
  /** Set to `false` to force mailto-only contact (e.g. static GitHub Pages without API). Default: capture via API when `VITE_API_BASE_URL` is set. */
  readonly VITE_PUBLIC_LEAD_CAPTURE?: string;
  /** GA4 measurement ID (e.g. G-XXXXXXXX). Loads gtag only when set. */
  readonly VITE_GA_MEASUREMENT_ID?: string;
  /** Google Search Console HTML tag verification content */
  readonly VITE_GOOGLE_SITE_VERIFICATION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
