import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Optional GA4 and Search Console verification — enabled only when env vars are set.
 * Does not load third-party scripts until measurement ID is present.
 */
export function MarketingScripts() {
  useEffect(() => {
    const verification = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION?.trim();
    if (verification) {
      const existing = document.querySelector('meta[name="google-site-verification"]');
      if (!existing) {
        const meta = document.createElement("meta");
        meta.name = "google-site-verification";
        meta.content = verification;
        document.head.appendChild(meta);
      }
    }
  }, []);

  useEffect(() => {
    const id = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
    if (!id || document.getElementById("ga4-loader")) return;

    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", id, { send_page_view: true });

    const script = document.createElement("script");
    script.id = "ga4-loader";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(script);
  }, []);

  return null;
}
