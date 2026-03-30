export type PublicLeadPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  pageUrl?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  company?: string;
};

export type SubmitLeadResult =
  | { ok: true; via: "api" }
  | { ok: true; via: "mailto" }
  | { ok: false; error: string };

function apiBase(): string {
  return (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
}

/** When true, POST to API first when `VITE_API_BASE_URL` is set. */
function leadCaptureEnabled(): boolean {
  return import.meta.env.VITE_PUBLIC_LEAD_CAPTURE !== "false";
}

export async function submitPublicLead(payload: PublicLeadPayload): Promise<SubmitLeadResult> {
  const base = apiBase();
  if (!leadCaptureEnabled() || !base) {
    return { ok: false, error: "no_api" };
  }

  try {
    const res = await fetch(`${base}/api/public/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.status === 201) {
      return { ok: true, via: "api" };
    }

    const err = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    return {
      ok: false,
      error: err?.error?.message ?? `HTTP ${res.status}`
    };
  } catch {
    return { ok: false, error: "network" };
  }
}

export function shouldTryApiFirst(): boolean {
  return leadCaptureEnabled() && apiBase().length > 0;
}
