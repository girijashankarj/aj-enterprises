declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fire GA4 `generate_lead` when gtag is available (after MarketingScripts mounts). */
export function trackGenerateLead() {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
  if (!id || typeof window.gtag !== "function") return;
  window.gtag("event", "generate_lead", {
    method: "contact_form"
  });
}
