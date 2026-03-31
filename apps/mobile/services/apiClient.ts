/**
 * Base URL for AJ API (same routes as web-admin: /api/...).
 * Android emulator: http://10.0.2.2:4000 — physical device: http://<your-lan-ip>:4000
 */
export function getApiBaseUrl(): string {
  const raw = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  return raw && raw.length > 0 ? raw.replace(/\/$/, "") : "http://localhost:4000";
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function parseJsonSafe(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { raw: text };
  }
}

export async function apiFetchJson<T>(
  path: string,
  init: RequestInit & { token?: string }
): Promise<T> {
  const base = getApiBaseUrl();
  const url = `${base}/api/${path.replace(/^\//, "")}`;
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string> | undefined)
  };
  if (init.token) {
    headers.Authorization = `Bearer ${init.token}`;
  }
  if (init.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(url, { ...init, headers });
  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    if (payload && typeof payload === "object") {
      const top = payload as { message?: string; error?: { message?: string } };
      if (typeof top.message === "string") msg = top.message;
      else if (typeof top.error?.message === "string") msg = top.error.message;
    }
    throw new ApiError(msg, res.status);
  }
  return payload as T;
}

/** Unauthenticated POST (e.g. Google token exchange). */
export async function apiPostPublic<T>(path: string, body: Record<string, unknown>): Promise<T> {
  return apiFetchJson<T>(path, {
    method: "POST",
    body: JSON.stringify(body)
  });
}
