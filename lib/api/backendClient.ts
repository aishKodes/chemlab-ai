import { BackendApiError } from "@/lib/api/apiErrors";
import type { BackendEnvelope } from "@/lib/api/backendTypes";
import { clearAuthStorage, getStoredToken } from "@/lib/auth/tokenStorage";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  token?: string | null;
  timeoutMs?: number;
  headers?: HeadersInit;
  query?: Record<string, string | number | boolean | null | undefined>;
};

const DEFAULT_TIMEOUT_MS = 12000;
const DEFAULT_BACKEND_URL = "https://api.chemlearning.in";

export function getBackendBaseUrl() {
  return (process.env.NEXT_PUBLIC_BACKEND_URL || DEFAULT_BACKEND_URL).replace(/\/+$/, "");
}

export function isBackendConfigured() {
  return Boolean(getBackendBaseUrl());
}

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const baseUrl = getBackendBaseUrl();
  if (!baseUrl) {
    throw new BackendApiError(
      "Chemlab account services are not connected yet. Public labs still work while setup is completed.",
      "BACKEND_NOT_CONFIGURED",
    );
  }

  const url = new URL(path.startsWith("/") ? path : `/${path}`, baseUrl);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

export async function backendRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  const token = options.token === undefined ? getStoredToken() : options.token;

  try {
    const response = await fetch(buildUrl(path, options.query), {
      method: options.method ?? "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: controller.signal,
    });

    let payload: BackendEnvelope<T> | null = null;
    try {
      payload = (await response.json()) as BackendEnvelope<T>;
    } catch {
      throw new BackendApiError("The backend returned an unreadable response.", "INVALID_JSON", response.status);
    }

    if (response.status === 401) {
      clearAuthStorage();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("chemlab-auth-cleared"));
      }
    }

    if (!response.ok || !payload.ok) {
      const message =
        payload && !payload.ok ? payload.error.message : "The backend could not complete this request.";
      const code = payload && !payload.ok ? payload.error.code : "REQUEST_FAILED";
      throw new BackendApiError(message, code, response.status);
    }

    return payload.data;
  } catch (error) {
    if (error instanceof BackendApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new BackendApiError("The backend took too long to respond. Please try again.", "REQUEST_TIMEOUT");
    }
    throw new BackendApiError(
      "Chemlab could not reach account services right now. You can keep exploring public labs.",
      "BACKEND_UNAVAILABLE",
    );
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

export const backendClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    backendRequest<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    backendRequest<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    backendRequest<T>(path, { ...options, method: "PUT", body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    backendRequest<T>(path, { ...options, method: "DELETE" }),
};
